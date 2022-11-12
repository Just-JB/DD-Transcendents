import Image from "next/image";
import _ from "lodash"

import config from "../../public/collectionManifest.json" // collection Manifest adapted to store z-index information as well

const NFTDisplay = ({activeNFT, traitReference, previewTrait}: any) => {

    return (
        <div className="relative w-full aspect-square rounded">
            {
            _.map(Object.keys(config), key => {
                
                const index = _.findIndex(activeNFT.json.attributes, { "trait_type": key })                
                
                if (key === traitReference && previewTrait != "") {
                    return (
                        <Image key={key} className={config[key].order + " rounded"} src={config[key].traits[previewTrait]} layout="fill" />
                )
                }
                if (activeNFT.json.attributes[index]) {
                    return (
                        <Image key={key} className={config[key].order + " rounded"} src={config[key].traits[activeNFT.json.attributes[index]?.value.replace(" ", "_")]} layout="fill" />
                    )
                }
            })
            }
        </div>
    )
}

export default NFTDisplay;