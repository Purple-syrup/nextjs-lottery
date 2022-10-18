import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
export default function LotteryEntrace() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    console.log(parseInt(chainIdHex));
    const chainId = parseInt(chainIdHex);
    const [fee, setFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setrecentWinner] = useState("0");
    const dispatch = useNotification();
    const raffleAddresss = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const { runContractFunction: enterRaffle,isLoading,isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddresss,
        functionName: "enterRaffle",
        params:{},
        msgValue: fee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddresss,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddresss,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddresss,
        functionName: "getRecentWinner",
        params: {},
    });

    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNewNotification(tx);
        updateUi();
    };

    const handleError= async function(e){
        handleErrorNotification(e);
        updateUi();
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        });
    };

    const handleErrorNotification = function (e) {
        dispatch({
            type:"error",
            message: e.message,
            title: "Tx Notification",
            position: "topR",
            icon:"bell",
        });
    };

    async function updateUi() {
        const feeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumberOfPlayers()).toString();
        const recentWinnerFromCall = await getRecentWinner();
        setNumPlayers(numPlayersFromCall);
        setrecentWinner(recentWinnerFromCall);
        setFee(feeFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi();
        }
    }, [isWeb3Enabled]);
    return (
        <div className="p5">
            <div>hi from lotter entrance!</div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                onClick={async function () {
                    await enterRaffle({
                        onSuccess: handleSuccess,
                        onError: handleError,
                    });
                }}
                disabled={isLoading || isFetching}
            >
                {isLoading ||isFetching ? (<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>):(<div>Enter Raffle!</div>)}
            </button>
            {raffleAddresss ? (
                <div>
                    Entrance fee: {ethers.utils.formatUnits(fee, "ether")} Eth <div>Number of players:{numPlayers} </div>
                    
                   <div> Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>no address detected</div>
            )}
        </div>
    );
}
