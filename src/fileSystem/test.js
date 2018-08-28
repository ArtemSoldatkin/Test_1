import React, {Component} from 'react'
import { Upload, message, Button, Icon, Popconfirm } from 'antd';
import {connect} from 'react-redux';
import XLSX from 'xlsx';
import _ from 'lodash'

import styled from 'styled-components'

const Text = styled.p`
    text-shadow: 0 0 8px rgba(lighten($color, 50%), 0.3);
    font-family: Courier, monospace;
    font-smoothing: antialiased;
    margin: 0.8em 0;
    font-size: 18px;
    color: #B95;   
`;

const StyledUpload = styled(Upload)`
    .ant-upload {
        float: left;
    }
    .ant-btn {
        background-color:  #90806A;   
    }    
`;

const ImportDiv = styled.div`
    position: absolute;
`;


class test extends Component{

    state = {
        file: "",
        fileUploadType: false
    }

    changeFile = () =>{         
        let {file, fileUploadType} = this.state,
            reader = new FileReader();
        if(file){
            reader.readAsArrayBuffer(file);
            reader.onload = () =>{
                let count,
                    data = new Uint8Array(reader.result),
                    wb = XLSX.read(data, {type:'array'}), 
                    first_worksheet = wb.Sheets[wb.SheetNames[0]],           
                    dataTable = XLSX.utils.sheet_to_json(first_worksheet, {header:this.props.headers, raw: true});
                !fileUploadType ? count = this.props.store.length : count = 0;        
                dataTable.map(element => {                
                    element.key = String(count);
                    ++count;
                });
                !fileUploadType ? this.props.onAddMan([...dataTable]) : this.props.onReloadMan([...dataTable]);  
            }
        }  
    }

    uploadChange = info =>{        
        if (info.file.status === 'done'){
            message.success(`Файл "${info.file.name}" успешно загружен`);
            if(info.fileList.length > 1 && this.props.store.length != 0){
                this.setState({file:info.file.originFileObj}, () => this.popConfirm.click());
            }else{
                this.setState({file:info.file.originFileObj}, () => this.changeFile());                
            }
            info.fileList = _.remove(info.fileList, a => {          
                return a.uid !== info.file.uid;
            })  
        }else if (info.file.status === 'error'){
            message.error(`Ошибка загрузки файла "${info.file.name}"`);
        }
    }

    confirm = () =>{
        this.setState({fileUploadType:true}, () => this.changeFile());   
    }

    cancel = () =>{
        this.setState({fileUploadType:false}, () => this.changeFile());
    }

    render(){
        const uploadProps = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
              authorization: 'authorization-text',
            },
            accept:".csv, .xlsx, .xls",
            onChange: this.uploadChange
        };
  
        return(
            <ImportDiv>
                <Text>Выберите таблицу в формате xls, xlsx или csv:</Text>
                    <Popconfirm title="Перезаписать данные в таблице?" onConfirm={this.confirm} onCancel={this.cancel} okText="Да" cancelText="Нет" >
                        <div ref={(node) => {this.popConfirm = node}}></div>
                    </Popconfirm>
                <StyledUpload {...uploadProps}>
                    <Button>
                    <Icon type="upload" /> Click to Upload
                    </Button>
                </StyledUpload> 
            </ImportDiv>
        )
    }
}

export default connect(
    state =>({    
        store:state.mans
    }),
    dispatch =>({
      onAddMan: (name) =>{ 
        dispatch({type: "FILE_MAN", payload: name});
      },
      onReloadMan: (name) =>{
        dispatch({type: "EDIT_MAN", payload: name})
      }
    })
)(test)