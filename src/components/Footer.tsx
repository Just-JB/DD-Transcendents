import { FC } from 'react';

export const Footer: FC = () => {
    return (
        <div className="">
            <footer className="mx-auto flex flex-row p-2 text-center items-center justify-between footer">
                <div className="pl-2">
                    <img
                        src="/logo-transparent.png"
                        width="40"
                        height="40"
                        alt="OceanGuardians NFT"
                    />
                </div>
                <div className="grid-flow-col gap-4 text-center pr-2">
                    <div>
                        <p className="cursor-default ">
                            Powered by
                        </p>
                        <a
                            rel="noreferrer"
                            href="https://oceanguardiansnft.com/"
                            target="_blank"
                            className="text-base font-bold transition-all duration-200"
                        >
                            Dynamic Labs
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
