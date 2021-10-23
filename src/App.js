import './App.css';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Component } from 'react';
import logo from './logo192.png';

const url="https://61736fee110a74001722302b.mockapi.io/Usuarios";

class App extends Component {

  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    modalPerfil: false,
    form:{
      id: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      ciudad: '',
      pais: '',
      tipoModal:''
    }
  }

  

  peticionGet=()=>{
    axios.get(url).then(response =>{
      this.setState({data: response.data});
    })
  }

  peticionPost=async()=>{
    delete this.state.form.id;
    await axios.post(url,this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPut=()=>{
    axios.put(url+"/"+this.state.form.id, this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete=()=>{
    axios.delete(url+"/"+this.state.form.id).then(response=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  modalPerfil=()=>{
    axios.get(url+"/"+this.state.form.id).then(response=>{
      this.setState({modalPerfil: !this.state.modalPerfil});
      this.peticionGet();
    })
  }

  seleccionarUsuario=(usuario)=>{
    this.setState({
      tipoModal:'actualizar',
      form:{
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        ciudad: usuario.ciudad,
        pais: usuario.pais
      }
    })
  }


  handleChange=async e =>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount(){
    this.peticionGet();
  }




  render(){
    const {form}=this.state;
    return (
      <div className="Nav">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
         <p className="navbar-brand">ItConsultores</p>
         <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal:'insertar'}); this.modalInsertar()}}>Agregar Usuario</button>
        </div>
        <div className="collapse">
        
        </div>
      </nav>
      <div className="App container">
      <br/><br/>
        <h1>Prueba ItConsultores</h1>
       <br/><br/>
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Ciudad</th>
              <th>Pais</th>
              <th>Interacciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(usuario=>{
              return(
                <tr>
                  <td> {usuario.id} </td>
                  <td> {usuario.nombre} </td>
                  <td> {usuario.apellido} </td>
                  <td> {usuario.email} </td>
                  <td> {usuario.telefono} </td>
                  <td> {usuario.ciudad} </td>
                  <td> {usuario.pais} </td>
                  <td>  
                      <button className="btn btn-primary" onClick={()=>{this.seleccionarUsuario(usuario); this.modalInsertar()}}><FontAwesomeIcon icon= {faEdit} /></button>
                      {"   "}
                      <button className="btn btn-danger" onClick={()=>{this.seleccionarUsuario(usuario); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon= {faTrashAlt} /></button>
                      {"   "}
                      <button className="btn btn-warning" onClick={()=>{this.seleccionarUsuario(usuario); this.setState({modalPerfil: true})}}><FontAwesomeIcon icon= {faEye} /></button>
                      {"   "}
                  </td>
                </tr>
              )
            })}

          </tbody>

        </table>


        <Modal isOpen={this.state.modalInsertar}>
                  <ModalHeader style={{display: 'block'}}>
                    <span style={{float:'rigth'}} onClick={()=>this.modalInsertar()}>x</span>
                  </ModalHeader>
                  <ModalBody>
                    <div className="form-group">
                      <label htmlFor="id">ID</label>
                      <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id:this.state.data.length+1}/>
                      <br/>
                      <label htmlFor="nombre">Nombre</label>
                      <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre:''}/>
                      <br/>
                      <label htmlFor="apellido">Apellido</label>
                      <input className="form-control" type="text" name="apellido" id="apellido" onChange={this.handleChange} value={form?form.apellido:''}/>
                      <br/>
                      <label htmlFor="email">Email</label>
                      <input className="form-control" type="text" name="email" id="email" onChange={this.handleChange} value={form?form.email:''}/>
                      <br/>
                      <label htmlFor="telefono">Telefono</label>
                      <input className="form-control" type="number" name="telefono" id="telefono" onChange={this.handleChange} value={form?form.telefono:''}/>
                      <br/>
                      <label htmlFor="ciudad">Ciudad</label>
                      <input className="form-control" type="text" name="ciudad" id="ciudad" onChange={this.handleChange} value={form?form.ciudad:''}/>
                      <br/>
                      <label htmlFor="pais">Pais</label>
                      <input className="form-control" type="text" name="pais" id="pais" onChange={this.handleChange} value={form?form.pais:''}/>
                      <br/>
                      
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    {this.state.tipoModal==='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                      Insertar
                    </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar</button>}
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>
                      Cancelar
                    </button>
                  </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar al Usuario:  {form && form.nombre+" "+form.apellido}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-light" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalPerfil}>
            <ModalHeader style={{display: 'block'}}>
                    <span style={{float:'rigth'}} onClick={()=>this.modalPerfil()}>x</span>
            </ModalHeader>
            <ModalBody>
            
              <div className="text-center">
              <h1>Perfil</h1>
              <img  src={logo} alt=""/>
                
              </div>
              <div className="App">
               <h2>{form && form.nombre+" "+form.apellido}</h2>
               <h6>Correo Electronico:</h6> <p>{form && form.email}</p>
               <h6>Telefono:</h6> <p>{form && form.telefono}</p>
               <h6>Ciudad:</h6> <p>{form && form.ciudad}</p>
               <h6>Pais:</h6> <p>{form && form.pais}</p>
               </div>
            </ModalBody>
            <ModalFooter>
            <div className="text-center">
              <button className="btn btn-danger" onClick={()=>this.modalPerfil()}>Cerrar</button>
            </div>
            </ModalFooter>
          </Modal>
      </div>
      </div>
      );
  }
}

export default App;
