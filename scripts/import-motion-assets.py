"""Validate and copy finalized Imagegen atlases; measure accessory anchors from alpha."""
from pathlib import Path
from PIL import Image
import hashlib,json,shutil,sys

root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root.parent/'work/motion-assets'
target=root/'public/assets/motion';target.mkdir(parents=True,exist_ok=True)
ids=['ed','snorri','roland','marianne','juergen','mauritia','michael','thomas','annkathrin','frederik','alexia','miriam','katja','nicolas','max','matthias','laurent','reinhold','nathalie','andreas','wakala','graumacher']
anchors={};manifest=[]
for id in ids:
    path=source/f'{id}.png';image=Image.open(path)
    assert image.mode=='RGBA' and image.size==(2048,1536),(id,image.mode,image.size)
    poses=[];rows=[]
    for row in range(6):
        fingerprints=[]
        for col in range(8):
            cell=image.crop((col*256,row*256,(col+1)*256,(row+1)*256));alpha=cell.getchannel('A');box=alpha.getbbox()
            assert box and box[0]>0 and box[1]>0 and box[2]<256 and box[3]<256,(id,row,col,'crop')
            top=box[1];height=box[3]-top;head_h=round(height*(.42 if id in ['ed','snorri','wakala'] else .27))
            points=[]
            for y in range(top,min(255,top+head_h)):
                for x in range(256):
                    if alpha.getpixel((x,y))>150:points.append(x)
            points.sort();assert points,(id,row,col,'head')
            left=points[len(points)//20];right=points[len(points)*19//20];width=max(16,right-left+1)
            poses.append({'head':{'x':left,'y':top,'w':width,'h':head_h},'neck':{'x':round(left+width*.48),'y':top+head_h}})
            fingerprints.append(hashlib.sha256(cell.tobytes()).hexdigest())
        rows.append(len(set(fingerprints)))
    anchors[id]=poses;manifest.append({'id':id,'columns':8,'rows':6,'frameWidth':256,'frameHeight':256,'frames':48,'distinctFramesPerRow':rows,'groundBaseline':246,'airBaseline':224})
    shutil.copy2(path,target/path.name)
    print(id,rows)
(target/'anchors.json').write_text(json.dumps(anchors,separators=(',',':')),encoding='utf-8')
(target/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
