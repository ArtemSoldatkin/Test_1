import React, { Component } from 'react';
import {connect} from 'react-redux';
import XLSX from 'xlsx';
import moment from 'moment';
import { saveAs } from 'file-saver/FileSaver';
import { Flex, Box } from 'reflexbox';
import { Button ,Radio} from 'antd';
import {FileInput} from './style';
import _ from 'lodash';



const RadioGroup = Radio.Group;

class fileWorker extends Component{

    state = {
        value: ""
      }
    
      onChange = (e) => {        
        this.setState({ value: e.target.value});
      }


    changeFile = event =>{
        var file = event.target.files[0];   
        let reader = new FileReader();
        if(file){
            reader.readAsArrayBuffer(file);
            reader.onload = () =>{
                let data = new Uint8Array(reader.result);
                let wb = XLSX.read(data,{type:'array'});   
                let first_worksheet = wb.Sheets[wb.SheetNames[0]];
               // let dataTable = XLSX.utils.sheet_to_json(first_worksheet, {header:["SecondName", "Name", "PatronymicName", "Age", "Salary"], raw: true});            
                let dataTable = XLSX.utils.sheet_to_json(first_worksheet, {header:["Фамилия","Имя","Отчество","Возраст","Зарплата"], raw: true});
                let count = this.props.store.length;        
                dataTable.map((element)=>{                
                  element.key = String(count);
                  ++count;
                });
                this.props.onAddMan([...dataTable]);               
            }
        }  
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
            return _.pick(element, ["Фамилия","Имя","Отчество","Возраст","Зарплата"]);            
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

        let a = [
            {
                key:1,
                name: "a"
            },
            {
                key:2,
                name: "b"
            },
            {
                key:3,
                name: "c"
            }
        ]
        let b = {name:""}
        console.log("Without a", _.pick(a, _.keys(b)))
        console.log("Clear a",a)

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };

        return(        
            <Flex className="File-Worker">

                <Box w={1/2} m={2}>
                    <p>Выберите таблицу в формате xls, xlsx или csv</p>
                    <FileInput type="file" onChange={this.changeFile} accept=".csv, .xlsx, .xls" />
                </Box>




                <Box w={1/2} m={2}>

                    
                    <p>Выберите тип файла:</p>
                    
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio style={radioStyle} value={"xlsx"}>XLSX</Radio>
                        <Radio style={radioStyle} value={"xls"}>XLS</Radio>
                        <Radio style={radioStyle} value={"csv"}>CSV</Radio>
                    </RadioGroup>

                    <Button type="primary" icon="download" size="default" onClick={this.saveFile} disabled={(this.state.value === "") ? true : false}>Скачать</Button>
                </Box>



            </Flex>
        );
    }
}


export default connect(
    state=>({    
        store:state.mans
    }),
    dispatch=>({
      onAddMan: (name) =>{ 
        dispatch({type: "FILE_MAN", payload: name});
      }
    })
)(fileWorker)





