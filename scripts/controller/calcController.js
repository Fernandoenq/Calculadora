class CalcController{
    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false//para controlar o estado do audio
        this._operation = []; //onde sera guardado a operação do usuário na calculadora 
        this._lastOperator = '';
        this._lastNumber = '';
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector('#display');//pegamos o elemento display e colocamos numa variavel(o El é para definirmos um padrao de variaveis com elemento)
        this._dateEl = document.querySelector('#data');//pegamos o elemento display
        this._timecEl = document.querySelector('#hora');//pegamos o elemento display

        //this._displayCalc = "0"; //é o que vai aparecer no display
        //com o this dá pra chamar a variavel em qUALQUER LUGAR DA CLASSE
        //ele só sera chamado para colocar ou resgatar informação
        this._currentDate;
        this.initialize();//executa quando começa
        this.initButtonEvents();//o principal que pega a ação do mouse sobre os bottões
        this.initKeyboard(); //metodo para iniciar a detecção das teclas do teclado
        this.copyToClipBoard();//metodo para o copiar e colar ctrl + C e ctrl + V
        //this.pastFromClipBoard();//Metodo para colar
    }

    pastFromClipBoard(){
        document.addEventListener('paste', e=>{//ao precionar o ctrl + v
           let text = e.clipboardData.getData('Text')//pegado o texto copiado
           console.log(text)
           this.displayCalc = parseFloat(text)
        })
    }

    copyToClipBoard(){
        let input = document.createElement('input')//criando um elemento dinamico na tela
        input.value = this.displayCalc//colcando o valor que esta na tela
        document.body.appendChild(input)//agora ele estará na tela
        input.select()//agora é possivel selecionar o conteudo
        document.execCommand("Copy")
        input.remove()
    }
    

    initialize(){ 
        this.setDisplayDateTime()
        //executa assim que começar
        //DOM é o modelo de objetos do documento
        //comandos que começam com windows estará trabalhando com a janela do navegador
        //comandos que começam com document estará trabalhando com o documento
        //QuerySelector manipula os elmentos com JS
        /*let displayCalcEl = document.querySelector('#display')//pegamos o elemento display e colocamos numa variavel(o El é para definirmos um padrao de variaveis com elemento)
        let dateEl = document.querySelector('#data')//pegamos o elemento display
        let timecEl = document.querySelector('#hora')//pegamos o elemento display
*/
        //Se tivermos trabalhando com o DOM temos acesso ao innerHTML
        //esse iner pega um objeto e coloca algo nele em html 
        //displayCalcEl.innerHTML = "123"
        //dateEl.innerHTML = "16/04/2022"
        //timecEl.innerHTML = "12:35"

        // setInterval é fazer algo a tantos segundos
        //no caso é 1000ms ou 1s
        //colocamos numa variável
        //esse set interval espera o primeiro tempo passar para começar tanto que fica tudo 1 segundo sem nada
        setInterval(() => {
            this.setDisplayDateTime();
        },  1000); 
        this.setLastNumberToDisplay();
        this.pastFromClipBoard();
        document.querySelectorAll('.btn-ac').forEach(btn=>{//clicar 2 vezes
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio()//controla estado do audio
            })
        })
        //this.setLastNumberToDisplay();
        /*set interval, settimeout
        ja começa a contar desde o primeiro tempo
        //ele só executa uma vez depois de passar o tempo dado
        //que no caso seria 10s
        let interval = setInterval(() => {
            this.displayDate = this.currentDate.toLocaleDateString(this._locale);//Atualiza a data
            this.displayTime = this.currentDate.toLocaleTimeString(this._locale);//Atualiza o horário
        },  1000);

        setTimeout(() => {
            clearInterval(interval);//ele aqui pararia a função de atualizar o tempo executada com o setInterval
        }, 10000);*/
    }
    toggleAudio(){//controla estado do audio
        this._audioOnOff = !this._audioOnOff //se audio for true esta ligado ent desliga, se tiver desligado liga
    }
    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;//zero o tempo para que ele possa tocar mesmo sem ter terminado
            this._audio.play();
        }
    }
    initKeyboard(){
        document.addEventListener('keyup', e=>{//começando um evento de ouvir ações, ele ouve o aperto das teclas e faz a função e
            //console.log(e.key, 'testando evento e')

            this.playAudio()
            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey){//ao apertar o C para entrar no case o CTRL era true?(esta sendo segurado)
                        this.copyToClipBoard()
                    }
                    this.copyToClipBoard()
                    break;
            }
        });
    }

    addEventListenerAll(element, events, fn){//criando um evento para executar vários eventos quando clicar num botao
        //passa o elemetno clicado
        //o nome dos eventos
        //qual é a função
        
        //o events vem em string dizendo várias funções que tem q executar
        //por isso vamos separalo e percorrer por todos
        events.split(' ').forEach(event => {//vai passar cada event no elemento
            element.addEventListener(event, fn, false);//vai executar no elemento passado o evento da vez com a função escolhida e com um false pra nao rolar 2 vezes já que o clique esta no botao e no texto
        })

    }

    clearAll(){//método para limpar tudo, usado quando clica no botao AC da calculadora
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator ='';
        this.setLastNumberToDisplay();
    }
    clearEntry(){//método para limpar o último valor colocado, usado quando clica no botao CE da calculadora
        this._operation.pop();//função já do js que deleta o último elemento do array
    }
    setError(){
        this.displayCalc = "Error"
    }
    getLastOperation(){
        return this._operation[this._operation.length-1]//o a contagem começa do 0 porem o lenght começa do 1, entao para pegar a última casa tem que tirar 1
    }
    setLastOperation(value){
        this._operation[this._operation.length-1] = value
    }
    isOperator(value){
        /*if(['+', '-', '*', '/', '%'].indexOf(value) > -1){//ele vai procurar dentro de value os itens da lista, se achar retorna a casa, se nao achar retorna -1
            return true;
        }else{
            return false;
        }*/
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);//verifica se é maior que -1
        //ele vai procurar dentro de value os itens da lista, se achar retorna a casa, se nao achar retorna -1
    }
    getResult(){
        //console.log('getresult', this._operation)
        try{
            return eval(this._operation.join(""))
        }catch(e){
            console.log(e)
            this.setError();
            this.clearAll();
            
        }
        
    }
    calc(){//vamos calcular os 2 valores que chegaram com o seu operador

        
        let last = '';
        this._lastOperator = this.getLastItem();//pegando o último operador
        if(this._operation.length < 3){//se for menos que 4 casas então já foi feito o primeiro igual e ele vai recolocar os valores
            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
        if(this._operation.length > 3){
            last = this._operation.pop()
            //no caso é se a pessoa colocou mais de 3 itens, entao seria (valor, operador, valor, operador, igual)
            //entao vou ter que salvar o último operador colocado
            //salvar tambem o resultado antes desse operador
            //e se ficar clicando no "=" mais de 2 vezes ele fara
            //o primeiro resultado, último operador, resultado atual
            //this._lastOperator = this.getLastItem();//pegando o último operador
            this._lastNumber = this.getResult()//passo o resultado para uma variável

        }else if(this._operation.length == 3){
            //Esse é o caso da pessoa ter colocado um (valor, operador, valor, igual)
            //ai teria que salvar o último valor colocado e o último operador
            //Assim seria (resultado, operador, lastvalor )
            //caso tenha sido apenas um = ent salva normal e pau no gato
            //this._lastOperator = this.getLastItem();//pegando o último parametro
            this._lastNumber = this.getLastItem(false)//pegando o último numero
        }
        //console.log('_lastOperator', this._lastOperator)
        //console.log('_lastNumber', this._lastNumber)
         //recorto o último operador e guardo na variável
        let result = this.getResult()//passo o resultado para uma variável

        if(last == '%'){
            result /= 100;
            this._operation = [result];
        }else {
            //O eval executa operações e comando lendo strings
            //o join pega um array e mescla geral numa string
            this._operation = [result]; //pego o array principal, e coloco o resultado na pri
            if(last) this._operation.push(last);
        }
        
        this.setLastNumberToDisplay();

    }
    pushOperation(value){
        this._operation.push(value);//adiciona o operador numa nova casa do array
        if(this._operation.length > 3){//se for maior que 3 quer dizer que ja tem 3 casas no array, ent já esta sendo colocado o segundo operador
            this.calc();
            //console.log("chegou no quarto valor", this._operation)
        }
    }

    getLastItem(isOperator = true){
        let lastItem;
        for (let i = this._operation.length-1; i >= 0; i--){
            /*if(isOperator){//Se o último for operador verificar o último numero usado
                if (this.isOperator(this._operation[i])) {
                    lastItem = this._operation[i];
                    break;
                }
            }else{//Se o útimo nao for operador verificar o último operador usado
                if (!this.isOperator(this._operation[i])) {
                    lastItem = this._operation[i];
                    break;
                }
            }*/
            //Se eu passar true no parametro vai correr atras de um operador, se eu passar false vai crrer atras de um numero
            // se for true ele vai olhar todas as casas, a cada olhada retorna true ou false, true quando operador, false quando numero
            // então se retorna true e o parametro passador for true ele salva o cara da casa que no caso seria o operador
            // se ele retorna false e o parametro passado for false ele salva o cara da casa que no caso seria o numero
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }
        if(!lastItem) {  //se ele nao encontrar
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber//se operador for true queremos o ultimo operador. se for false queremos o ultimo numero
        }
        return lastItem;//ele retorna o último item
    }

    setLastNumberToDisplay(){//seto o último numero do display, chamado quando inicia, reseta ou atualiza tudo

        let lastNumber = this.getLastItem(false) //quero guardar o último numero entao passo o getlastitem com false; ele retorna o valor e nao o binario
        
        if (!lastNumber) lastNumber = 0;//boto 0 no display pra nao ficar vago
        this.displayCalc = lastNumber;

    }
    addOperation(value){

        console.log('Ferdinando',value,  isNaN(this.getLastOperation()));

        if(isNaN(this.getLastOperation())){//Se o último valor não for númerico faça
            //string
            if(this.isOperator(value)){
                //trocar o operador
                this.setLastOperation(value);//vou pegar o último item e atualizar com o novo
            }else if(isNaN(value)){
                console.log(value)
            }else{//se o antigo valor nao era nem numero nem string ent nao tinha nada
                this.pushOperation(value);
                //atualizar display
                this.setLastNumberToDisplay();
            }
        }else{ //se for número

            if(this.isOperator(value)){//se nao for número, é operador, ent adiciona
                this.pushOperation(value);//adiciona o operador numa nova casa do array
                //atualizar display
                this.setLastNumberToDisplay();
            }else{
                //Number
                let newValue = this.getLastOperation().toString() + value.toString()//preciso transformar em string pois se eu teclar 2 e depois 3, não vira 23, vira 5, no string vira 23
                this.setLastOperation(newValue);//adiciona no array
                //atualizar display
                this.setLastNumberToDisplay();
            }
        }
        console.log(this._operation);
    }

    addDot(){
        let lastOperation = this.getLastOperation();
        
        //lastOperation.split('').indexOf('.') > -1 pego a última operação da calca, divido cad a membro dela com o split e verifico com indexof se tem o . no array
        //se tiver o index retorna a casa do '.', ent sera de 0 pra frente, se ele nao achar ent retorna -1
        //typeof lastOperation === 'string' verifica se nessa operation tem um texto nela, se nao tiver quer dizer que nao tem nada ent verifica se tem um ponto para caso  ja tenha um ponto nao pode passar
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;//verifica se ela existe e se ja possui um ponto se sim ele sai do método com o return

        console.log(lastOperation)
        if(this.isOperator(lastOperation) || !lastOperation){//Se o último do array for um operador ou nao for nada
            this.pushOperation('0.')//Adiciona um 0. 
        }else{//agora se tiver um número por último ent
            this.setLastOperation(lastOperation.toString() + '.')//vai pegar a última coisa que tem, transforma em string e concatena com um '.'
        }
        this.setLastNumberToDisplay();//atualiza o display
    }
    execBtn(value){//vou descobrir qual botao foi clicado e fazer a função de cada um
        this.playAudio();
        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                break;
        }
    }

    initButtonEvents(){//para eventos do botao
        //os botoes estão dentro da tag g chamada buttons
        //os textos estão dentro da tag g chamada parts
        //vamos pegar todos os g dentro de cada grupo dessas tag
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");//todos os botoes estao na tag g buttons


        buttons.forEach((btn, index)=>{//vai passar por todos os botoes e textos
            /*btn.addEventListener('click', e => {//adiciona um evento ao clique desse botao que foi passado
                console.log(btn.className.baseVal.replace("btn-",""));//ele vai mostrar qual botao que é e tirar o btn-do nome
            })*/
            this.addEventListenerAll(btn, 'click drag', e => {//adiciona um evento ao clique desse botao que foi passado a letra e é o nome da função
                //console.log();//ele vai mostrar qual botao que é e tirar o "btn-" do nome
                let textBtn = btn.className.baseVal.replace("btn-","")
                this.execBtn(textBtn);//para executar a ação desse botao
                //no caso vou enviar para o evento qual botao eu cliquei
            });
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = "pointer";
            })
        })
        

    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"

        });//Atualiza a data
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);//Atualiza o horário
    }

    //cirando os getters() and setters()

    //display da data e hora
    get displayTime(){
        return this._timecEl.innerHTML
    }
    set displayTime(value){
        return this._timecEl.innerHTML = value
    }

    get displayDate(){
        return this._dateEl.innerHTML
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value
    }

    //Display
    get displayCalc(){ //para pegar o que tem dentro do display calc
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){ //para setar o valor de dentro
        if(value.toString().length > 10){
            this.setError();
            return false;
        }
        return this._displayCalcEl.innerHTML = value;
    }

    //Data
    get currentDate(){ //para pegar o que tem dentro da data
        //return this._currentDate;
        return new Date();//Já é do JS, ele retorna a data atual do pc

    }

    set currentDate(value){ //para setar o valor de dentro
        return this._currentDate = value;
    }
}