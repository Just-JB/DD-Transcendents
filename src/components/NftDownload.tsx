import _ from "lodash";
import config from "../../public/collectionManifest.json";
import Image from "next/image";
import { toJpeg} from "html-to-image";
import { saveAs } from "file-saver";
import { useState } from "react";

const NftDownload = ({activeNFT}: any) => {
    const [loading, setLoading] = useState(false);

    const downloadNFT = async() => {
        setLoading(true)
        const NFT = document.getElementById('downloadContainer');

        const filter = (node: any)=>{
            
            const exclusionClasses = ['exclude'];
            return !exclusionClasses.some(classname=>node.classList.contains(classname));
        }

        await toJpeg(NFT, { filter: filter})
            .then(function (dataUrl) {                
                saveAs(dataUrl, `${activeNFT.name}.jpeg`)
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
        });

        setLoading(false)
    }
    
    return(
        <div>
            <input type="checkbox" id="downloadModal" className="modal-toggle" />
            <label htmlFor="downloadModal" className="modal cursor-pointer">
                <label className="modal-box relative bg-lighter">

                    <div className="exclude absolute z-[60] inset-10">
                        <button className={"exclude btn bg-button border-0 " + (loading && " loading")} onClick={downloadNFT}>DOWNLOAD</button>
                    </div>

                    <div className="relative w-full aspect-square rounded" id="downloadContainer">
                        {
                        _.map(Object.keys(config), key => {
                            
                            
                            const index = _.findIndex(activeNFT?.json.attributes, { "trait_type": key });

                            if (activeNFT.json.attributes[index]) {                                
                                return (
                                    <Image key={key} className={config[key].order + " rounded"} src={config[key].traits[activeNFT.json.attributes[index].value.replace(" ", "_")]} layout="fill" />
                                )
                            }
                        })
                        }
                    </div>
                </label>
            </label>
        </div>
    )
}

export default NftDownload