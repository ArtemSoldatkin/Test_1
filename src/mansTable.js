import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import {connect} from 'react-redux';

const Search = Input.Search;
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {

    state = {
      editing: false
    }
  
    componentDidMount = () =>{
      if (this.props.editable) document.addEventListener('click', this.handleClickOutside, true);   
    }
  
    componentWillUnmount = () => {
      if (this.props.editable) document.removeEventListener('click', this.handleClickOutside, true);     
    }
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) this.input.focus();        
      });
    }
  
    handleClickOutside = e => {
      const { editing } = this.state;
      if (editing && this.cell !== e.target && !this.cell.contains(e.target)) this.save();     
    }
  
    save = () => {
      const { record, handleSave } = this.props;
      this.form.validateFields((error, values) => {
        if (error) return;    
        this.toggleEdit();
        handleSave({ ...record, ...values });
      });
    }
  
    render() {
      const { editing } = this.state;  
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        ...restProps
      } = this.props;
      return (
        <td ref={node => (this.cell = node)} {...restProps}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  editing ? (
                    <FormItem style={{ margin: 0 }}>
                      {form.getFieldDecorator(dataIndex, {
                        rules: [{
                          required: true,
                          message: `Поле "${title}" не заполнено`,
                        }],
                        initialValue: record[dataIndex],
                      })(
                        <Input
                          ref={node => (this.input = node)}
                          onPressEnter={this.save}
                        />
                      )}
                    </FormItem>
                  ) : (
                    <div
                      className="editable-cell-value-wrap"
                      style={{ paddingRight: 24 }}
                      onClick={this.toggleEdit}
                    >
                      {restProps.children}
                    </div>
                  )
                );
              }}
            </EditableContext.Consumer>
          ) : restProps.children}
        </td>
      );
    }
}

class mansTable extends Component {
   
      state={
        searchInput:""
      }

      handleDelete = key => {
        this.props.onDelete(key)
      }
    
      handleAdd = () => {      
        const newData = {
          key: String(this.props.storeWhithoutFilters.length),
          Фамилия: "-",
          Имя: "-",
          Отчество: "-",
          Возраст: 0,
          Зарплата: 0
        };     
        this.props.onAddMan(newData);
      }
    
      handleSave = row => {
        //-----
          row.Зарплата = Number(row.Зарплата)
          row.Возраст = Number(row.Возраст) 
        //-----

        const newData = [...this.props.storeWhithoutFilters];
        const index = newData.findIndex(item => row.key === item.key); 
        console.log("row", row, "   /   item", item)
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.props.onEdit(newData);
      }
    
      handleRemove = () =>{
        this.props.onEdit([]);
      }

      searchInputOnChange = (e) =>{
        this.setState({searchInput:e.target.value},() =>{
          this.props.onFilter(this.state.searchInput);
        });        
      }

    render(){     
        
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
        };

        let columns = [
            {
                title:"Фамилия",
                dataIndex:"Фамилия",
                key:"Фамилия",
                editable: true,
                sorter: (a, b) => a.Фамилия.length - b.Фамилия.length               
            },
            {
                title:"Имя",
                dataIndex:"Имя",
                key:"Имя",
                editable: true,
                sorter: (a, b) => a.Имя.length - b.Имя.length
            },
            {
                title:"Отчество",
                dataIndex:"Отчество",
                key:"Отчество",
                editable: true,
                sorter: (a, b) => a.Отчество.length - b.Отчество.length
            },
            {
                title:"Возраст",
                dataIndex:"Возраст",
                key:"Возраст",
                editable: true,
                sorter: (a, b) => a.Возраст - b.Возраст
            },
            {
                title:"Зарплата",
                dataIndex:"Зарплата",
                key:"Зарплата",
                editable: true,
                sorter: (a, b) => a.Зарплата - b.Зарплата
            },            
            {
                title: '',
                dataIndex: 'operation',
                render: (text, record) => {
                  return (
                    this.props.store.length > 0
                      ? (
                        <Popconfirm title="Уверены что хотите удалить?" onConfirm={() => this.handleDelete(record.key)}>
                          <a href="javascript:;">Удалить</a>
                        </Popconfirm>
                      ) : null
                  );
                },
              }
        ];

        columns = columns.map((col) => {
            if (!col.editable) return col;        
            return {
              ...col,
              onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: this.handleSave,
              }),
            };
        });

        return(
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16}}>
                    Добавить поле
                </Button>
                <Search
                    placeholder="Введите текст для поиска"
                    //onChange={value => this.props.onFilter(value)}
                    value={this.state.searchInput} 
                    onChange={this.searchInputOnChange}
                   // onEdit={console.log("a")}
                    style={{ width: 200 }}
                />
                <Button onClick={this.handleRemove} type="danger" style={{ marginBottom: 16, float: "right"}}>
                    Очистить таблицу
                </Button>
                <div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={this.props.store}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}

export default connect(
    state=>({    
     store:state.mans.filter(man => {
        let check = false;
        for(let i in man){
          if(i!=="key"){
            if(String(man[i]).toLowerCase().includes(state.filter.toLowerCase())){
              check = true;
              break;
            }
          }
        }
        return check;
     }),
     storeWhithoutFilters: state.mans     
    }),
    dispatch=>({
      onAddMan: (name) =>{ 
        dispatch({type: "ADD_MAN", payload: name});
      },
      onFilter: (text) =>{
        dispatch({type:"FILTER_MAN", payload:text});
      },
      onDelete: (key) =>{
        dispatch({type:"DELETE_MAN", payload:key});
      },
      onEdit: (data) =>{
        dispatch({type:"EDIT_MAN", payload:data});
      }  
    })
)(mansTable)
