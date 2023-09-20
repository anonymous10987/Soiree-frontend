import React, { useEffect, useState } from 'react'
import { LinksRow } from '../../components/diff/LinksRow';
import { DiffRender } from '../../components/diff/DiffRender';
import { DiffSelector } from './selector/DiffSelector';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { Upgrade } from '../../lib/upgrade';
import { ErrorContent } from '../../components/error/ErrorContent';
import { Loading } from '../../components/loading/Loading';
import { InfoContent } from '../../components/error/InfoContent';
import { BaseParams } from '../../app';
import { fillPreviousImpl, fillVerified, formatUpgrades, trimFirstUpgradeIfEmpty } from '../../lib/utils/format';
import { VerifiedStatus } from '../../lib/verified_status';
import { BASE_URL } from '../../config/api';
import { SyncStatusData } from '../../lib/sync_status';
import { ApiName } from 'ethereum-sources-downloader';
import { Skeleton } from 'antd';
import { SelectorSkeleton } from './selector/SelectorSkeleton';

interface MultiDiffContainerPropsData {
    error?: string,
    info?: string,
    upgrades: Upgrade[],
}

export interface MultiDiffContainerProps {
    data?: MultiDiffContainerPropsData
    loadingMsg?: string
    getPathParams: (match: any) => BaseParams
}

async function fetchVerifiedStatuses(address: string, network: string): Promise<VerifiedStatus[]> {
    const response = await fetch(
        `${BASE_URL}/verified_impls`,
        {
            method: 'POST',
            body: JSON.stringify({
                address: address,
                network: network
            }),
            headers: {
                'content-type': 'application/json'
            }
        }
    )

    if (response) {
        const json = await response.json()
        if (json.status === 'ok') {
            return json.data;
        } else if (json.status === 'nok') {
            console.error('Error during fetch of verified status of implementations');
            return undefined;
        }
    }
}

async function fetchSyncStatus(address: string, network: ApiName): Promise<SyncStatusData> {
    const response = await fetch(
        `${BASE_URL}/request_scan_status`,
        {
            method: 'POST',
            body: JSON.stringify({
                address: address,
                network: network
            }),
            headers: {
                'content-type': 'application/json'
            }
        }
    )

    if (response) {
        const json = await response.json()
        if (json.status === 'ok') {
            return json.data && {
                processing: json.data?.requested,
                last_update_ts: json.data?.latest_update_ts
            };
        } else if (json.status === 'nok') {
            console.error('Error during fetch of verified status of implementations');
            return undefined;
        }
    }
}

function getInfoContent(upgrade?: Upgrade) {
    if (!upgrade.unavailable_reason) {
        return <InfoContent
            info={'Code diff unavailable for this upgrade'} />
    } else if (upgrade.unavailable_reason === 'PREVIOUS_AND_TARGET_UNAVAILABLE') {
        return <InfoContent
            info={'Both previous and target implementations are not verified on block explorer'} />
    } else if (upgrade.unavailable_reason === 'PREVIOUS_UNAVAILABLE') {
        return <InfoContent
            info={'Previous implementation is not verified on block explorer'} />
    } else if (upgrade.unavailable_reason === 'TARGET_UNAVAILABLE') {
        return <InfoContent
            info={'Target implementation is not verified on block explorer'} />
    } else if (upgrade.unavailable_reason === 'PREVIOUS_EQUALS_TARGET') {
        return <InfoContent
            info={'Target implementation is the same as previous implementation'} />
    }
}

function renderContent(
    info?: string,
    error?: string,
    dataAvailable?: boolean,
    loadingMsg?: string,
    selectedUpgrade?: Upgrade) {
    if ((!error && !info && !dataAvailable) || loadingMsg) {
        const message = loadingMsg ? loadingMsg : 'Loading'
        return <Loading message={message} />
    } else if (dataAvailable && !selectedUpgrade) {
        return <InfoContent
            info={'No upgrades available for this proxy'} />
    } else if (info) {
        return <InfoContent
            info={info} />
    } else if (error) {
        return <ErrorContent
            error={error} />
    } else if (selectedUpgrade && selectedUpgrade.verified) {
        return <DiffRender
            key={selectedUpgrade.current_impl}
            network={selectedUpgrade.network}
            address={selectedUpgrade.previous_impl}
            diff={selectedUpgrade.diff} />
    } else if (selectedUpgrade) {
        return getInfoContent(selectedUpgrade);
    } else {
        return <></>
    }
}

export function MultiDiffContainer(props: MultiDiffContainerProps) {
    const [selectedUpgrade, setSelectedUpgrade] = useState(undefined);
    const [verifiedImpls, setVerifiedImpls] = useState(undefined);
    const defaultSyncStatus: SyncStatusData = {
        processing: true,
        last_update_ts: '0'
    }
    const [syncStatus, setSyncStatus] = useState(defaultSyncStatus);
    const pathParams = props.getPathParams(props);

    let upgrades = formatUpgrades(props.data?.upgrades || []);
    fillPreviousImpl(upgrades);

    useEffect(() => {
        fetchVerifiedStatuses(pathParams.address, pathParams.network).then(x => {
            setVerifiedImpls(x);
        }).catch(e => undefined)
    }, []);

    useEffect(() => {
        fetchSyncStatus(pathParams.address, pathParams.network as ApiName).then(x => {
            setSyncStatus(x);
        }).catch(e => undefined)
    }, [upgrades?.length == 0])

    fillVerified(upgrades, verifiedImpls);
    upgrades = trimFirstUpgradeIfEmpty(upgrades);

    if (upgrades && upgrades.length && !selectedUpgrade) {
        setSelectedUpgrade(upgrades[0]);
    }

    return (<>
        <Sider className='sider' style={{
            background: 'white'
        }}
            width={220}>
            <div className='upgrade_selector'>
                {
                    upgrades?.length > 0 ?
                        <DiffSelector
                            upgrades={upgrades || []}
                            setSelectedDiff={setSelectedUpgrade}
                        /> :
                        <SelectorSkeleton />
                }
            </div>
        </Sider>
        <Content style={{
            background: 'white'
        }}>
            <LinksRow
                address={pathParams.address}
                currentImpl={selectedUpgrade?.current_impl}
                network={pathParams.network}
                oldImpl={selectedUpgrade?.previous_impl}
                transaction_hash={selectedUpgrade?.tx_hash}
                unavailable={selectedUpgrade && !selectedUpgrade.verified}
                unavailable_reason={selectedUpgrade?.unavailable_reason}
                sync_status={syncStatus}
            />
            {renderContent(
                props.data?.info,
                props.data?.error,
                !!(props.data?.upgrades),
                props.loadingMsg,
                selectedUpgrade)}
        </Content>
    </>);
};