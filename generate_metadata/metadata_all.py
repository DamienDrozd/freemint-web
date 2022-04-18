
import json
import os
import shutil
from utility.nftstorage import NftStorage
    
    
    
#### Generate Metadata 
if os.path.exists('./metadata') == False:
    
    os.mkdir(f'./metadata')
else:
    shutil.rmtree('./metadata')
    os.mkdir(f'./metadata')



NB_NFT = 20
FILE_NAME = "metadata"
IMAGE_NAME = "./image/nomad-fire.gif"
IMAGE_TYPE = 'image/gif'
PROJECT_NAME = "Nomad Is Burning "
ROYALTIES_AMOUNT = 10

DESCRIPTION = "Part of the Nomad Digital 240 collection, The Burning Logo has been created in collaboration with Jean Ewen [see on website](https: // www.nomadgallerynft.com/collections/nomad-digital-240)"
# DESCRIPTION = "test description"

NFTSTORAGE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUzZGU2RjRjZTdlYTdEZERiOWJFMGVCMTIzMjNDOENDODViNDQxNzUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0Njg1OTM0ODg3MywibmFtZSI6InRlc3QifQ.oqGDpxt1uHvOcFKCUXaYhxuRUEG6VJDLjuFtt77C90I"


nstorage = {}
meta_file_list = []
file_list = []
ANIMATION_BASE_URL = ""
IMAGES_BASE_URL = ""
c = NftStorage(NFTSTORAGE_API_KEY)


#image upload
if(IMAGE_NAME != "" and IMAGE_TYPE != ""):
    imageid = c.upload([IMAGE_NAME], IMAGE_TYPE)
    nstorage['image_cid'] = imageid
    IMAGES_BASE_URL = "ipfs://" + str(imageid) + "/" + IMAGE_NAME.split("/")[2]
  



#metadata creation

for i in range(1,NB_NFT+1):
    token = {
        "original_creator": "0x9ff7720fadacf06f199f4f75a12a47abe5431c35",
        "image": IMAGES_BASE_URL,
        "tokenId": i,
        "name": PROJECT_NAME + '- #' + str(i) + "/" + str(NB_NFT),
        "description": DESCRIPTION,
        "edition_total": NB_NFT,
        "royalty_amount": ROYALTIES_AMOUNT,
        "copyright_transfer": False,
        "resellable": True    
    }
    jsonfile = str("./metadata/"  + str(i) + ".json")
    with open(jsonfile,"w") as outfile:
        json.dump(token, outfile, indent=4)
    
    meta_file_list.append(jsonfile)

    

#metadata upload
for i in range(len(meta_file_list)):
    print(meta_file_list[i])
    
cid = c.upload(meta_file_list, 'application/json')
nstorage['metadata_directory_cid'] = cid
print(nstorage)
    
    
with open("metapath.json", "w") as metapath:
    for i in range(len(meta_file_list)):
        
        json.dump("ipfs://" +  nstorage['metadata_directory_cid'] + "/" + meta_file_list[i].split('/')[2], metapath, indent=4)

    

