import React from 'react';
import { Button, Toast, List, Icon, Modal, TextareaItem, Radio, InputItem, Tag } from 'antd-mobile';
var calm;
export default class updateVideo extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {

        }
    }
    render() {
        return (
            <div>wewssd</div>
            // <div>
            //     <div className="my_flex sameBack">
            //         <span className="textTitle">上传封面
            //             <p style={{ margin: 0, height: 5 }}></p>
            //             <span className="uploadSupport">(jpg格式)</span>
            //         </span>
            //         {calm.state.addVideoList[i].coverPath.length == 0 ?
            //             <button className="" onClick={calm.uploadImage.bind(this, i)}>上传封面</button>
            //             :
            //             <div className="upload_file">
            //                 <img onClick={calm.imgPreview.bind(this, calm.state.addVideoList[i].coverPath)}
            //                     className="imgTag" src={calm.state.addVideoList[i].coverPath} />
            //                 <div className="icon_pointer" onClick={calm.uploadImage.bind(this, i)}>修改</div>
            //             </div>
            //         }

            //     </div>
            //     <div className="line_public flex_container"></div>
            //     <div className="my_flex sameBack">
            //         <span className="textTitle">上传视频
            //             <p style={{ margin: 0, height: 5 }}></p>
            //             <span className="uploadSupport">(MP4格式)</span>
            //         </span>
            //         {calm.state.addVideoList[i].videoUrl.length == 0 ?
            //             <button className="" onClick={calm.uploadMp4.bind(this, i)}>上传视频</button>
            //             :
            //             <div className="upload_file">
            //                 <video
            //                     onClick={calm.mp4Preview.bind(this, calm.state.addVideoList[i])}
            //                     src={calm.state.addVideoList[i].videoUrl}></video>
            //                 {/* <div 
            //                     className="musicIcon" /> */}
            //                 <div className="icon_pointer" onClick={calm.uploadMp4.bind(this, i)}>修改</div>
            //             </div>

            //         }
            //     </div>
            //     <div className="line_public flex_container"></div>
            //     <div>心情描述</div>
            //     <TextareaItem
            //         className="add_element"
            //         placeholder="请输入心情描述"
            //         value={calm.state.addVideoList[i].videoContent}
            //         onChange={calm.inputOnChange.bind(this, i)}
            //         rows={5}
            //         count={50}
            //     />
            //     <div className="line_public flex_container"></div>
            //     <List renderHeader={() => '视频类型'}>
            //         {typeDate.map(item => (
            //             <RadioItem
            //                 key={item.value}
            //                 checked={calm.state.addVideoList[i].videoType === item.value}
            //                 onChange={() => calm.onChangeRadio(i, item.value)}>
            //                 {item.label}
            //             </RadioItem>
            //         ))}
            //     </List>
            //     <div style={{ display: calm.state.addVideoList[i].show ? "block" : "none" }}>
            //         挑战
            //         <span style={{ display: !(calm.state.showDelete) ? "block" : "none" }} onClick={calm.addChan.bind(this, i)}>添加挑战</span>
            //         <div>
            //             <span className="deleteCha" style={{ display: calm.state.showDelete ? "block" : "none" }} onClick={calm.deleteCha.bind(this, i)}>删除</span>
            //             <div>
            //                 {calm.state.addVideoList[i].cheData.label}</div>
            //             <div>
            //                 {calm.state.addVideoList[i].cheData.extra}
            //             </div>
            //         </div>
            //     </div>
            //     <div>标签
            //         {
            //             calm.state.addVideoList[i].tagText.map((v, i) => {
            //                 return (
            //                     <div className="spanTag">
            //                         <span className="textOver">{v.tagTitle}</span>
            //                         <span className="del_tag" onClick={calm.deleteTag.bind(this, v, useIndex)}></span>
            //                     </div>
            //                 )
            //             })
            //         }
            //         {
            //             calm.state.addVideoList[i].tagText.length == 3 ?
            //                 ""
            //                 :
            //                 <span onClick={calm.addTag.bind(this, i)}>添加标签</span>

            //         }
            //     </div>

            // </div>
        )
    }
}