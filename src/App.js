import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Flex, Box } from 'reflexbox';
import MansTable from './mansTable';
import DiagramBar from './DiagramBar';
import {Title, Body} from './style';
import FileSystem from './fileSystem';


import styled from 'styled-components'

const Header = styled.header`
  background-color: #90806A;
  text-align: center;
`;
const Footer = styled.footer`
  background-color: #90806A;
  text-align: right;
`;

class App extends Component {
  render() {
    return (  
      <div style={{margin:0, padding: 0}}>
        <Header>
          <Title>Тестовое задание 1</ Title>
        </Header>   
        <Body>
          <FileSystem /> 
          <DiagramBar />            
          <Flex>
            <Box w={1} m={2}>
              <MansTable />
            </Box>
          </Flex>           
        </Body>
        <Footer>
          Солдаткин Артём
        </Footer>
      </div>
    );
  }
}

export default App;
