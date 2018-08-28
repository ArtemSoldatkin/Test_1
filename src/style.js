import styled from 'styled-components';

const FileInput = styled.input`
position: relative;
background: #1890ff;
border-radius: 4px;
color: #fff;
text-align: center;
padding: 0 15px;
font-size: 14px;
border: 1px solid transparent;
touch-action: manipulation;
height: 32px;
`;
const Title = styled.h1`
  font-family: 'Merriweather', serif;
  position: relative;
  color: #FCF2E5;
  background: #90806A;
  font-size: 2.5em;
  font-weight: normal;
  padding: 10px 40px;
  display: inline-block;
  margin: 0;
  line-height: 1;
`;
const Body = styled.div`
  background: #FCF2E5;
  padding: 50px 20px;
  text-align: center;
`;

export {FileInput, Title, Body};