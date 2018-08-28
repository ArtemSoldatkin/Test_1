import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Box } from 'reflexbox';
import _ from 'lodash';
import { Button ,Radio} from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
import { saveAs } from 'file-saver/FileSaver';



import styled from 'styled-components'
const Text = styled.p`
    text-shadow: 0 0 8px rgba(lighten($color, 50%), 0.3);
    font-family: Courier, monospace;
    font-smoothing: antialiased;
    margin: 0.8em 0;
    font-size: 18px;
    color: #B95;   
`;
const ExportForm = styled(Box)`

    .ant-radio-group{
        display: block;
        float: left;
    }
    .ant-btn{
        background-color:#90806A;
        display: block;
        float:left;
    }
`;



const RadioGroup = Radio.Group;

class Export extends Component{
    state = {
        value: ""
    }
    
    onChange = (e) => {        
        this.setState({ value: e.target.value});
    }

     
    saveFile = () => {
        let wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Peoples",
            Subject: "Test1",
            Author: "Artem",
            CreatedDate: moment().format('YYYY','MM','DD')
        };
        wb.SheetNames.push("Peoples");

        let exportData = this.props.store.map((element)=>{                
            return _.pick(element, this.props.headers);            
        });         
        let ws = XLSX.utils.json_to_sheet(exportData)
        wb.Sheets["Peoples"] = ws;
        let wbout = XLSX.write(wb, {bookType:this.state.value,  type: 'binary'});
        const s2ab = s => {
          let buf = new ArrayBuffer(s.length);
          let view = new Uint8Array(buf);
          for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;            
        }
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `Peoples.${this.state.value}`);         
    } 

    render(){      

        return(
            <ExportForm w={1/2} m={2}>                    
                    <Text>Выберите тип файла:</Text>                    
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value={"xlsx"}>XLSX</Radio>
                        <Radio value={"xls"}>XLS</Radio>
                        <Radio value={"csv"}>CSV</Radio>
                    </RadioGroup>
                    <Button type="primary" icon="download" size="default" onClick={this.saveFile} disabled={(this.state.value === "") ? true : false}>Скачать</Button>
              

            </ExportForm>
            
                    


        )
    }
}

export default connect(
    state=>({    
        store:state.mans
    })
)(Export)
