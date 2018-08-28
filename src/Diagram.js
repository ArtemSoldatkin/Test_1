import React from 'react'
import { XAxis, YAxis, CartesianGrid , BarChart, Bar, Tooltip , LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import _ from 'lodash';

const FirstDiagram = ({data}) =>{    
    return(
        <div>
            <p>Cтолбчатая диаграмма по зарплате сотрудников  </p>
            <BarChart width={600} height={300} data={data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>    
                    <XAxis dataKey="Фамилия" stroke="#8884d8" />
                    <YAxis stroke="#8884d8"/>                   
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Bar type="monotone" dataKey="Зарплата" fill="#8884d8" barSize={30} yAxisId={0}/>
                    <Tooltip />
            </BarChart>
        </div>
    )
}

const SecondDiagram = ({data}) => {
    let  newData = _.sortBy(data, [o => { return o.Возраст; }])
  
    return (
        <div>
            <p>График зависимости зарплаты от возраста </p>
            <LineChart width={600} height={300} data={newData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis dataKey="Возраст"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>                
                    <Line type="monotone" dataKey="Зарплата" stroke="#8884d8" activeDot={{r: 8}}/>                
            </LineChart>            
        </div>
    )
}

const ThirdDiagram = ({data}) => {
    
    const diagramData = [
        {
            name: "18-30 лет",
            value: data.filter(element => Number(element.Возраст) >= 18 && Number(element.Возраст) < 30).length,
            key: 0
        },
        {
            name: "30-45 лет",
            value: data.filter(element => Number(element.Возраст) >= 30 && Number(element.Возраст) <= 45).length,
            key: 1
        },
        {
            name: "Старше 45 лет",
            value: data.filter(element => Number(element.Возраст) > 45).length,
            key: 2
        }
    ];
   
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    const RADIAN = Math.PI / 180;                    
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x  = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy  + radius * Math.sin(-midAngle * RADIAN);
        
            return (
                <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
    };
 
    return (
        <div>
            <p>Круговая диаграмма распределения сотрудников по возрасту (18 — 30 лет, 30-45 лет, от 45 и старше). </p>
            <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                <Pie         
                data={diagramData} 
                cx={300} 
                cy={200} 
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80} 
                fill="#8884d8"  
                dataKey='value'    
                >
                    {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)}
                </Pie>
                <Legend />
        </PieChart>
      </div>
    )
}

export { FirstDiagram, SecondDiagram, ThirdDiagram};
