<template>
    <main>
    <!-- Add the style and icon you want using the String format -->
    <!--<font-awesome-icon icon="fa-solid fa-user-secret" /> -->

    <b-modal v-model="modSenhaVisible" @hide="onCriaSenhaModalClose" hide-footer>
        <div class="modal-header">
            <h5 class="modal-title" style="margin-left: 30%"> {{ formPrimeiroAcesso.titulo }} </h5>
        </div>
        
        <b-form ref="form" @submit.prevent="sendEmail">
              <b-form-group label="Nome usuário" label-for="email">
                <b-form-input 
                  id="usuario" type="text" placeholder="Digite seu nome" v-model="formPrimeiroAcesso.nome"></b-form-input>
              </b-form-group>

              <b-form-group label="Matrícula" label-for="email">
                <b-form-input 
                  id="matricula" type="number" placeholder="Digite sua matricula" v-model="formPrimeiroAcesso.matricula"></b-form-input>
              </b-form-group>

              <b-form-group label="CPF:" label-for="email">
                <b-form-input 
                  id="cpf" type="number" placeholder="Digite seu CPF" v-model="formPrimeiroAcesso.cpf"></b-form-input>
              </b-form-group>
   
              <b-form-group label-for="senha">
                <label class="d-flex justify-content-between"> Senha </label>
   
                <b-form-input
                  id="senha" :type="PASSWORD_TYPE"  placeholder="Digite sua senha" v-model="formPrimeiroAcesso.senha"></b-form-input>
              </b-form-group>

              <b-form-group label-for="senha">
                <label class="d-flex justify-content-between"> Confirmação de Senha </label>
   
                <b-form-input
                  id="senha" :type="PASSWORD_TYPE" placeholder="Digite sua senha" v-model="formPrimeiroAcesso.senhaConfirm"></b-form-input>
              </b-form-group> 

              <b-form-checkbox  
                id="checkbox-1" v-model="isSenhaVisivel" switch>
                  Exibir senha
              </b-form-checkbox>

              <b-form-group label-for="senha">
                <label class="d-flex justify-content-between"> E-mail </label>
                <b-form-input
                  id="senha" type="email" placeholder="Digite seu email" v-model="formPrimeiroAcesso.email"></b-form-input>
              </b-form-group>

              <div>
                  <label :style="{ color:activeColor, 'font-family':'verdana', 'font-size':'11px' }"> {{ formPrimeiroAcesso.msgStatus }} </label>
              </div>

              <b-button
                type="button" variant="primary" block @click="defineSenha()" width="100px">
                <i class="fas fa-sign-in-alt"></i> {{ formPrimeiroAcesso.btnNameConfirm }}
              </b-button>
          </b-form>
    </b-modal>


    <b-row class="vh-100 vw-100 row-login">
      <b-col sm="5" class="d-flex justify-content-center align-items-center left-login">
        <div class="col-8">
          <!-- <h2 class="text-center mb-5 title-login"> Sistema de Gestão Operacional de Policiamento </h2> -->
          <div class="loginLabel">
              <div>
                <i class="fa-solid fa-lock"></i>
              </div>
              <!-- -->
              <div>
                  <h4> Login </h4>
              </div>
          </div>
          
          <b-form>
            <b-form-group label="Matrícula" label-for="email">
                <b-form-input
                  id="matricula"
                  type="text"
                  placeholder="Digite sua matricula"
                  v-model="form.matricula"
                ></b-form-input>
              </b-form-group>
   
              <b-form-group label-for="senha">
                <label class="d-flex justify-content-between">
                  Senha 
                </label>
   
                <b-form-input
                  id="senha"
                  type="password"
                  placeholder="Digite sua senha"
                  v-model="form.senha"
                ></b-form-input>
              </b-form-group>
   
              <label class="d-flex justify-content-between">
                    <small><a href="#" v-on:click="openCriaSenhaModal(true)"> Esqueceu sua senha? </a></small>  
                    <small style="margin-left: auto; margin-right: 0;"><a href="#" v-on:click="openCriaSenhaModal(false)"> Primeiro acesso? </a></small>
              </label>
              
              <b-button
                type="button"
                variant="primary"
                block
                @click="login()"
                width="100px">
                <i class="fas fa-sign-in-alt"></i>
                   Entrar
              </b-button>

              <my-modal 
                  id="myModal" 
                  title="Confirmation" 
                  :message="modalMessage" 
                  :visible="modalIsVisible" 
                  @update:visible="modalIsVisible = $event" 
                  @on-close-modal="handleCloseModal()"
                  @on-accept-modal="handleAcceptModal()"
                  @on-reject-modal="handleRejectModal()"/>
   
              <hr>
          </b-form>
        </div>
      </b-col>
      

      <!-- COLUNA SEGUNDA-->
      <b-col sm="7">
          <b-col sm="7" class="d-flex justify-content-center align-items-center">
            <img src="https://raw.githubusercontent.com/paulovfppiox/policiamento-assets/main/banner-login.jpg" class="img-login" />
          </b-col>
      </b-col>
    </b-row>
</main>
  </template>
   
  <script>
  import emailjs from '@emailjs/browser';
  import axios from 'axios';
  import MyModal from '@/components/MyModal.vue';
  
  export default {
    components: {
      MyModal
    },
    name: 'AppLogin',
    data()    
    {
      return      {
          modSenhaVisible: false,
          modalIsVisible: false,
          modalMessage: "Confirma operação?",
          usersDB: [],
          activeColor: '',
          isPrimeiroAcesso: true,
          isSenhaVisivel: false,
          form:   {
              matricula: "",
              senha: "",
          },
          formPrimeiroAcesso: {
              titulo: "",
              nome: "",
              cpf: "",
              matricula: "",
              senha: "",
              senhaConfirm: "",
              email: "",
              btnNameConfirm: "",
              msgStatus: "",
          },
          isValid: -1,
          novaSenha: 0,
      }
    },
    computed:  
    {
        PASSWORD_TYPE()     {
             return this.isSenhaVisivel ? 'text' : 'password';
        },
    },
    methods:      {
      openCriaSenhaModal( flag )          
      {
          console.log( "T => " + this.modSenhaVisible );
          if ( flag )   
          {
              this.formPrimeiroAcesso.titulo = "Redefinição de Senha";
              this.formPrimeiroAcesso.btnNameConfirm = "Criar senha";
          } else {
              this.formPrimeiroAcesso.titulo = "Primeiro Acesso";   
              this.formPrimeiroAcesso.btnNameConfirm = "Criar acesso";
          }
          this.modSenhaVisible = true;
      },
      onCriaSenhaModalClose()           {
          this.modSenhaVisible = false;
          this.formPrimeiroAcesso.msgStatus = " "; 
          this.isValid = -1;
      },
      onModalClose()                    {
          this.modalSenhaVisible = false;
      },
      handleCloseModal()                {
          this.modalIsVisible = false;
          this.modalMessage = "x";
      },
      handleAcceptModal()               {
          // console.log("Accept ... ");
          this.modalIsVisible = false;
          this.modalMessage = "y";
      },
      handleRejectModal()        {
          // console.log("Reject ... ");
          this.modalIsVisible = false;
          this.modalMessage = "d";
      },
      cifraSenha(text)           {
        var secretKey = "PAULO";
        const keyLength = secretKey.length;
        const encryptedText = [];
        for (let i = 0; i < text.length; i++) {
          const encryptedCharacter = text.charCodeAt(i) ^ secretKey.charCodeAt(i % keyLength);
          encryptedText.push(encryptedCharacter);
        }
        return encryptedText.join('');
      },
      defineSenha()       
      {
          this.formPrimeiroAcesso.msgStatus = "";
          console.log( this.formPrimeiroAcesso.email );
          console.log( this.formPrimeiroAcesso.matricula );
          console.log( this.formPrimeiroAcesso.senha );
          console.log( this.formPrimeiroAcesso.senhaConfirm ); 
          
          var isMailOk = ( /^[^@]+@\w+(\.\w+)+\w$/.test( this.formPrimeiroAcesso.email ) );
          

          if ( !this.formPrimeiroAcesso.email || !isMailOk )  
          {
                 console.log( "-EMAIL NOTTTT !!" );
                 this.modalMessage = "Email inválido ou vazio.";
                 this.modalIsVisible = true;
          }
          if ( this.formPrimeiroAcesso.senha.length > 0 ) {
                if ( this.formPrimeiroAcesso.senha != this.formPrimeiroAcesso.senhaConfirm )  {
                  this.modalMessage = "Senhas divergentes.";   
                  this.modalIsVisible = true;
                }
          }   else    {
            this.modalMessage = "Senha vazia.";   
            this.modalIsVisible = true;
          }

          var sendData = {
              dados:  {
                  entidade: 'usuario',
                  operacao: 'cadastrar',
                  objeto:              {
                     nome: this.formPrimeiroAcesso.nome,
                     matricula: this.formPrimeiroAcesso.matricula,
                     cpf: this.formPrimeiroAcesso.cpf,
                     email: this.formPrimeiroAcesso.email,
                     senha: this.cifraSenha( this.formPrimeiroAcesso.senha ),
                  }
              }
          }; 
          //var senha = this.cifraSenha( this.formPrimeiroAcesso.senha );
          console.log('-SEND DATA == ' + JSON.stringify(  sendData ) );

          axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
               .then( response => {
                      console.log('-Response DATA == ' + JSON.stringify(  response.data ) + typeof response.data );
                      this.modalIsVisible = true;
                      this.modalMessage = response.data.message;
              })
              .catch(error => {
                    this.error = error.message;
              });
      },
      sendEmail()   
      {

        /*var templateParams = {
            name: 'James',
            notes: 'Check this out!'
        };*/
        var SERVICE_ID = 'service_5sm00kk';

          try {
              emailjs.sendForm( SERVICE_ID, "template_olo1a4j", this.$refs.form, 'EKyeK2SupjUXpL9tt', 
              {
                name: "this.name",
                email: "paulo.fariaspaiva@gmail.com",
                message: "okokok"
              } )
          } catch( error )  {
              console.log({ error })
          }
          // Reset form field
          this.name = ''
          this.email = ''
          this.message = ''
      },
      login()             
      {
        // console.log( 'login !!!' );
        
        var mat = this.form.matricula;
        var senha = this.form.senha;
        // console.log( mat + senha );
        
        var sendData = {
          dados: {
              entidade: 'usuario',
              operacao: 'login',
              objeto: {
                matricula: mat,
                senha: this.cifraSenha( senha )
              }
          }
       };  
       console.log( "SEND Login request ||" + JSON.stringify( sendData ) );
       
       axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
            .then( response => {
                   console.log('-Response DATA == ' + JSON.stringify(  response.data ) + typeof response.data );

                   if ( ( typeof response.data ) == 'object' )  
                   {
                      var data = response.data;
                      console.log('-DATA == ' + JSON.stringify(  data )  );
                      console.log( "MSG = " + data.message + "|| code= " + data.code );
                      if ( data.code == 0 ) 
                      {
                           var nomeCompleto = data.data.nome;
                           const numEspacos = nomeCompleto.split(' ').length - 1;
                           console.log("Nome = " + nomeCompleto + " | " + numEspacos );
                              
                           var firstName, lastName;
                              
                           if ( numEspacos > 0 )        {
                                const nameParts = data.data.nome.split(' ');
                                firstName = nameParts[0];
                                lastName = nameParts[1];
                           }   else                     {
                                firstName = nomeCompleto;
                                lastName = '';
                           }
                           var userObj =                {
                                nome:firstName,
                                sobrenome:lastName,
                                matricula:data.data.matricula,
                                cpf: data.data.cpf,
                           }
                           this.$store.commit('setUser', userObj );

                           var x = this.$store.state.user.nome;

                           localStorage.setItem('user', JSON.stringify(userObj));
                           
                           console.log( "-- NOME = " + x );
                           this.$router.push('/home');

                      }   else    {
                            console.log( "MSG = " + data.message );
                            this.modalIsVisible = true;
                            this.modalMessage = response.data.message;
                          } 
                    }
                    console.log('code:', response.data.code) ;

              })
              .catch(error => {
                    this.error = error.message;
              });

        /* fetch('https://raw.githubusercontent.com/paulovfppiox/policiamento-assets/main/users.json')
        .then(response => response.json())
        .then(json => {
            this.usersDB = json;
            console.log( mat + " ---- " + senha );

            var obj1 = {matricula: mat, senha: senha}
            this.usersDB.push(obj1);
            var x = this.usersDB.indexOf(obj1);
            console.log( x );

        });*/
        
        
        // Aplica DELAY
        /* var tempo = 0;
        setTimeout(() => {
            this.$router.push('/home');
            console.log( tempo++ );
        }, 5000);*/
        
    },
      
      register() {
        console.log('registrar!!!');
      }
    }
  }
  </script>
   
  <style>
   
  *, /*resetar o estilo da página*/
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
  }
   
  .row-login {
    margin-left: 0;
  }
   
  .left-login {
    background-color: #F2F2F2;
  }
   
  .title-login {
    font-weight: bold;
  }
  .form-group {
    margin-top:15px;
    margin-bottom:15px;
  }
  .img-login  {
    width: 250%;
    height: calc(100vh - 120px);
    margin-inline-start: 330px;
    filter: blur(0.5px);
    -webkit-filter: blur(0.5px);
    opacity: 0.3;
  }
  .loginLabel   {
      display: flex;
      width: 20%;
      justify-content: space-between;
      overflow-x: auto;
  }
  </style>

