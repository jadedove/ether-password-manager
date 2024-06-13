import { ConnectButton } from "@rainbow-me/rainbowkit";
import Logo from "./assets/Logo";
import { CloseMenu } from "./assets/Hamburger";
import Avatar from "./assets/Avatar";
import { truncate } from "@/lib/utils";
export const ConnectButtonCustom = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const connected = account && chain;
        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex items-center gap-2 connectbtn p-2 min-w-[200px]"
                  >
                    <span className="bg-white p-1 rounded-[6px]">
                      <Logo width={24} height={24} />
                    </span>{" "}
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="flex gap-3 capsule p-2 min-w-[200px] items-center"
                  >
                    <span className="bg-[rgba(48,_60,_78,_0.80)] p-1 rounded-[6px]">
                      <CloseMenu width={24} height={24} />
                    </span>{" "}
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="flex gap-3 capsule p-2 min-w-[200px]">
                  <button
                    onClick={openChainModal}
                    className="rounded-[8px] bg-[rgba(48,_60,_78,_0.80)] p-2"
                  >
                    <Avatar />
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="flex flex-col w-full overflow-hidden"
                  >
                    <span className="text-[14px] text-ellipsis">John Doe</span>
                    <span className="text-[13px] w-full text-start text-ellipsis">
                      {truncate(account.address)}
                    </span>
                  </button>
                </div>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
