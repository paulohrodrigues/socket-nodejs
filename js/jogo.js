class Jogo {

    constructor(socket){
        this.map={
            tb11:-1,
            tb12:-1,
            tb13:-1,
            tb21:-1,
            tb22:-1,
            tb23:-1,
            tb31:-1,
            tb32:-1,
            tb33:-1
        }
        this.idGame=-1;
        this.status=false;
        this.user=(new Date()).getTime();
        this.round=0;
        this.socket=socket;
        this.simbolo="X";
        this.userAdversario = -1; 
    }

    play(){
        this.init();
        this.look();
        this.actionEvent();
        document.getElementById("clear").style="visibility: hidden;";
    }
    look(){
        var self=this;
        this.socket.on('send message', function(msg){
            switch(msg.option){
                case"init":{
                    self.lookInit(msg);        
                    break;
                }
                case"res":{
                    self.lookRes(msg);
                    break;
                }
                case"game_over":{
                    self.lookGameOver(msg);
                    break;
                }
                case"game":{
                    self.lookGame(msg);
                    break;
                }
            }
        });
    }

    init(){
        this.socket.emit('send message',{option:"init",user:this.user});
    }

    lookInit(msg){
        if(msg.user!=this.user){
            if(this.status==false){
                this.status=true;
                this.idGame=msg.idGame;
                this.simbolo="X";
                this.round=1;
                this.userAdversario=msg.user;
                alert("Sua Vez!");
                this.socket.emit('send message',{option:"res",user:this.user,userAdversario:msg.user,idGame:this.idGame});
            }
        }
    }


    lookRes(msg){
        if(this.user==msg.userAdversario && this.status==false){
            this.status=true;
            this.idGame=msg.idGame;
            this.simbolo="O";
            this.round=0;
            this.userAdversario=msg.user;
        }
    }


    lookGameOver(msg){
        if(msg.userAdversario==this.user){
            alert("Você Perdeu!");
        }
    }


    lookGame(msg){
        if(msg.userAdversario==this.user){
            this.round=1;
            this.map[msg.idMap]=(this.simbolo=="O")?"X":"O";
            document.getElementById(msg.idMap).innerHTML=this.map[msg.idMap];
            // alert("Sua Vez");
        }
    }

    actionEvent(){
        for(let i=1;i<=3;i++){
            for(let j=1;j<=3;j++){
                document.getElementById("tb"+i+""+j).addEventListener("click",(result)=>{
                    if(this.round==1){
                        this.check(result.toElement.id);
                    }else{
                        alert("Não é sua vez");
                    }      
                });
            }
        }
    }

    check(id){
        if(this.map[id]==-1){
            this.map[id]=this.simbolo;
            document.getElementById(id).innerHTML=this.simbolo;
            this.round=0;
            if(this.checkEndGame(id)==true){
                alert("Você Venceu!");
                this.socket.emit('send message',{option:"game_over",userAdversario:this.userAdversario});
            }else{
                this.socket.emit('send message',{option:"game",userAdversario:this.userAdversario,idMap:id});
            }
        }else{
            alert("Esse lugar já está marcado");
        }
    }


    checkEndGame(){
        for(let i=1;i<=3;i++){
            if( this.map["tb1"+i]==this.simbolo && this.map["tb2"+i]==this.simbolo && this.map["tb3"+i]==this.simbolo ) return true;
            if( this.map["tb"+i+"1"]==this.simbolo && this.map["tb"+i+"2"]==this.simbolo && this.map["tb"+i+"3"]==this.simbolo ) return true;
        }
        if( this.map["tb11"]==this.simbolo && this.map["tb22"]==this.simbolo && this.map["tb33"]==this.simbolo ) return true;
        if( this.map["tb13"]==this.simbolo && this.map["tb22"]==this.simbolo && this.map["tb31"]==this.simbolo ) return true;
        return false;
    }
}