import React  from 'react';
import { Flex, Box } from 'reflexbox';
import Import from './test';
import Export from './Export';


const headers = ["Фамилия","Имя","Отчество","Возраст","Зарплата"];

const fileSystem = () => {
        return(        
            <Flex>
                <Box w={1/2} m={2}>
                    <Import headers = {headers}/>
                </Box>

                <Export headers = {headers}/>                
            </Flex>
        );  
}

export default fileSystem;