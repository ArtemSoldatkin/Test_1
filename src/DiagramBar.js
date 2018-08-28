import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Radio, Button } from 'antd';
import { Flex, Box } from 'reflexbox';
import {FirstDiagram, SecondDiagram, ThirdDiagram} from './Diagram';

class diagramBar extends Component{
    state = {
        diagram:"",
        diagramBarVisibility: false
    }

    changeDiagram = event =>{
        this.setState({diagram:event.target.value}) 
    }
    
    changeDiagramBarVisibility = () =>{
        this.setState({diagramBarVisibility:!this.state.diagramBarVisibility});
    }
      
    BarChartDiagram = () =>{
        let {diagram} = this.state;
        switch(diagram){
          case "first":      
            return <FirstDiagram data={[...this.props.store]} />
          
          case "second": 
            return <SecondDiagram data={[...this.props.store]} />;
          
          
          case "third": 
            return <ThirdDiagram data={[...this.props.store]} />; 
         
          
          default:
            return <FirstDiagram data={[...this.props.store]} />
         
        }  
      }

     
    render(){
         
        return(
            <Flex>
                <Box w={1} m={2}>
                    <p>Диаграммы</p>
                    <Button type="primary" onClick = {this.changeDiagramBarVisibility}>{ this.state.diagramBarVisibility ? "Скрыть" : "Показать" }</Button>
                </Box>               
                <br />

               {this.state.diagramBarVisibility ?
                    (<Box w={1} m={2} style={{visibility:this.state.diagramBarVisibility}}>
                        <Radio.Group value="default">
                            <Radio.Button value="first" onClick={this.changeDiagram}>Cтолбчатая диаграмма по зарплате сотрудников</Radio.Button>
                            <Radio.Button value="second" onClick={this.changeDiagram}>График зависимости возраста от зарплаты</Radio.Button>
                            <Radio.Button value="third" onClick={this.changeDiagram}>Круговая диаграмма распределения сотрудников по возрасту</Radio.Button>
                        </Radio.Group>                    
                        <this.BarChartDiagram />
                    </Box>) :
                    null
                }

            </Flex>            
        );
    }
}
        
export default connect(
    state=>({    
        store:state.mans
    })
)(diagramBar)

