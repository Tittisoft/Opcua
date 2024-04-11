import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { PLCItem } from '@/configs/interfaces';
import Head from 'next/head';
import getPlcItems from '@/apis/getPlcItems.api';
import pingPlc from '@/apis/pingPlc.api';
import { ScaleLoader } from 'react-spinners';
import setPlcItemData from '@/apis/setPlcItemData.api';
import MyModal from '@/components/MyModal';

const inter = Inter({ subsets: ['latin'] });

type AppMode = 'get' | 'set' | 'ping';

export default function Home() {
  const [plcsData, setPlcsData] = useState<Record<
    PLCItem['IPADDRESS'],
    PLCItem['mData']
  > | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('set');
  const [selectedPlc, setSelectedPlc] = useState<PLCItem['IPADDRESS'] | null>(
    null
  );
  const [plcResDataObj, setPlcResDataObj] = useState('Sample Result');
  const [isFetching, setIsFetching] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [plcInputData, setPlcInputData] = useState('');

  const fetchAllPlcData = (selectedPlcIp?: string, showRes?: boolean) => {
    setIsFetching(true);
    const plcsObj: Record<PLCItem['IPADDRESS'], PLCItem['mData']> = {};

    getPlcItems()
      .then((plcsResData) => {
        plcsResData.PlcItems.forEach((plcItem) => {
          plcsObj[`${plcItem.IPADDRESS}`] = plcItem.mData;
        });

        setPlcsData((s) => ({ ...plcsObj }));

        if (selectedPlcIp) {
          setSelectedPlc(selectedPlcIp);
          showRes &&
            setPlcResDataObj(JSON.stringify(plcsObj?.[selectedPlcIp], null, 2));
        } else {
          setSelectedPlc(plcsResData.PlcItems[0].IPADDRESS);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsFetching(false);
        setTimeout(() => {
          setIsFetching(false);
        }, 400);
      });
  };

  // const fetchCurrentPlcData = (selectedPlc: string) => {
  //   setIsFetching(true);

  //   getPlcItemData()
  //     .then((plcResData) => {
  //       setPlcsData((s) => ({
  //         ...s,
  //         [selectedPlc]: plcResData,
  //       }));

  //       setPlcResDataObj(JSON.stringify(plcResData));

  //       setIsFetching(false);
  //       // setSelectedPlc(plcsResData.PlcItems[selectedIdx || 0].IPADDRESS);
  //     })
  //     .catch((e) => {
  //       setIsFetching(false);
  //       console.log(e);
  //     });
  // };

  const setCurrentPlcData = (
    selectedPlcIp: string,
    data: Parameters<typeof setPlcItemData>[0]
  ) => {
    setIsFetching(true);

    setPlcItemData(data)
      .then((plcResData) => {
        fetchAllPlcData(selectedPlcIp);
        // setSelectedPlc(plcsResData.PlcItems[selectedIdx || 0].IPADDRESS);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchAllPlcData(selectedPlc || undefined);
    var fetchInterval = setInterval(() => {
      fetchAllPlcData(selectedPlc || undefined);
    }, 1000 * 60);

    return () => {
      clearInterval(fetchInterval);
    };
  }, [selectedPlc]);

  const onPingPlcHandler = () => {
    setAppMode('ping');
    setIsDataLoading(true);
    selectedPlc &&
      pingPlc({ IpAddress: selectedPlc })
        .then((res) => {
          setPlcResDataObj(JSON.stringify(res));
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setIsDataLoading(false);
        });
  };

  const onSendPlcDataSubmit = () => {
    if (canSendPlcData) {
      selectedPlc &&
        plcsData &&
        setCurrentPlcData(selectedPlc, {
          CODICE: plcInputData,
          Uri: plcsData?.[selectedPlc].Uri,
        });
    } else {
      setIsModalOpen(true);
    }
  };

  const canSendPlcData =
    !!selectedPlc &&
    !!plcsData &&
    ['True', 'true', true].includes(plcsData?.[selectedPlc].Versione);

  return (
    <>
      <Head>
        <title>
          DICHEM OPC-UA : COMUNICAZIONE BIDIREZIONALE SIEMENS S7-1200 PLC
        </title>
      </Head>
      <main
        className={`flex  min-h-screen bg-slate-400 flex-col items-stretch  ${inter.className}`}
      >
        <header className="bg-slate-800 text-slate-50 py-3 px-[5.5%]">
          <h1 className="text-lg">
            <span className="text-base inline-block pr-9 font-medium ">
              DICHEM OPC-UA
            </span>{' '}
            COMUNICAZIONE BIDIREZIONALE SIEMENS S7-1200 PLC
          </h1>
        </header>
        <div className="flex flex-col items-stretch flex-1 py-[1%] px-[5.5%]">
          <div className="flex-1 rounded grid grid-cols-8 border-2 mb-8 bg-slate-50 border-gray-300 p-8">
            <div className="border col-span-3 p-6 gap-7 ">
              <div className=" gap-3 flex flex-col pt-8">
                <h2 className="text-xl font-semibold">PLC Data</h2>
                {plcsData && selectedPlc && (
                  <>
                    <p>
                      IP Address: <span>{selectedPlc}</span>
                    </p>
                    <p>
                      Status: <span>{plcsData[selectedPlc].Stato}</span>
                    </p>
                    <p>
                      Name: <span>{plcsData[selectedPlc].Nome}</span>
                    </p>
                    <p>
                      User: <span>{plcsData[selectedPlc].Valore}</span>
                    </p>
                    <p>
                      Code: <span>{plcsData[selectedPlc].CODICE}</span>
                    </p>
                    <p>
                      Auto: <span>{plcsData[selectedPlc].Versione}</span>
                    </p>
                    <p>
                      Serial: <span>{plcsData[selectedPlc].Uri}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="border col-span-5 p-4 flex flex-col">
              <div className="flex gap-6 mb-4">
                <button
                  disabled={isFetching || isDataLoading}
                  onClick={() => onPingPlcHandler()}
                  className="btn"
                >
                  Ping PLC
                </button>
                {/* <button
                  disabled={isFetching || isDataLoading}
                  onClick={() => {
                    setAppMode('get');
                    selectedPlc && fetchAllPlcData(selectedPlc, true);
                  }}
                  className="btn"
                >
                  Get PLC Data
                </button> */}
                <button
                  disabled={isFetching || isDataLoading}
                  onClick={() => {
                    setAppMode('set');
                  }}
                  className="btn"
                >
                  Set PLC Data
                </button>
              </div>

              {isDataLoading ? (
                <div className="border p-1 flex flex-1 flex-col items-center justify-center">
                  <ScaleLoader
                    loading={isDataLoading}
                    height={60}
                    width={5}
                    margin={3}
                    color="#456ba0"
                    radius={3}
                  />
                </div>
              ) : (
                <>
                  {appMode === 'set' && (
                    <div className="border p-1 flex flex-[0.5] flex-col">
                      <p className="mb-2">Send Data</p>
                      <textarea
                        value={plcInputData}
                        onChange={(e) => setPlcInputData(e.target.value)}
                        placeholder="CODICE"
                        className="border flex-1 text-gray-600 py-1 p-2 text-sm"
                      ></textarea>
                      <button
                        disabled={!plcInputData}
                        onClick={() => onSendPlcDataSubmit()}
                        className="btn self-end mt-2 mb-1"
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  {appMode === 'ping' && (
                    <div className="border mt-2 flex flex-col gap-2 flex-[0.5] p-2 shrink-0">
                      <p>Result Info</p>
                      <div className="flex-1 bg-white border p-2">
                        <p className="text-gray-600 text-sm">{plcResDataObj}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="border-2 rounded h-32 min-h-[20vh] p-4 gap-4 grid grid-flow-col auto-cols-fr">
            {Object.keys(plcsData || {}).map((ipAddr, idx) => {
              const isSelected = ipAddr === selectedPlc;

              return isFetching ? (
                <div className="flex flex-col justify-center items-center">
                  <ScaleLoader loading={isFetching} color="#ffffff" />
                </div>
              ) : (
                <div
                  role="button"
                  onClick={() => {
                    setSelectedPlc(ipAddr);
                  }}
                  key={ipAddr}
                  className={`border cursor-pointer rounded bg-slate-50 col-span-1 flex flex-col items-center justify-center ${
                    isSelected ? 'border-green-600 border-4' : ''
                  }
                  ${
                    isDataLoading
                      ? 'opacity-60 pointer-events-none cursor-wait'
                      : ''
                  }`}
                >
                  <p className="font-medium">{ipAddr}</p>
                  <p>{plcsData?.[ipAddr].Nome}</p>
                  <p>{plcsData?.[ipAddr].Stato}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <MyModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
}
