const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');


const teclasPressionadas = {
   KeyW: false,
   KeyS: false,
   KeyD: false,
   KeyA: false
};
document.addEventListener('keydown', (e) => {
   for (let tecla in teclasPressionadas) {
       teclasPressionadas[tecla] = false;
   }
   if (teclasPressionadas.hasOwnProperty(e.code)) {
       teclasPressionadas[e.code] = true;
   }
});

class Entidade {
   constructor(x, y, largura, altura, cor) {
       this.x = x;
       this.y = y;
       this.largura = largura;
       this.altura = altura;
       this.cor = cor;
   }
   desenhar() {
       ctx.fillStyle = this.cor;
       ctx.fillRect(this.x, this.y, this.largura, this.altura);
   }
}

class Cobra {
   constructor(x, y, largura, altura) {
       this.corpo = [{ x: x, y: y }];
       this.largura = largura;
       this.altura = altura;
       this.direcao = 'D';
   }
   

   atualizar() {
       const cabeca = this.corpo[0];
       let novoX = cabeca.x;
       let novoY = cabeca.y;
       
       switch (this.direcao) {
           case 'W': novoY -= 7; break;
           case 'S': novoY += 7; break;
           case 'A': novoX -= 7; break;
           case 'D': novoX += 7; break;
       }
       
      
       this.corpo.unshift({ x: novoX, y: novoY });
       
      
       if (!this.comer) {
           this.corpo.pop();
       }
       this.comer = false;
   }

   
   verificarColisao(comida) {
       const cabeca = this.corpo[0];
       if (
           cabeca.x < comida.x + comida.largura &&
           cabeca.x + this.largura > comida.x &&
           cabeca.y < comida.y + comida.altura &&
           cabeca.y + this.altura > comida.y
       ) {
           this.comer = true;
           comida.x = Math.random() * canvas.width - 10;
           comida.y = Math.random() * canvas.height - 10;
           return true;
       }
       return false;
   }

  
   verificarColisaoComCorpo() {
       const cabeca = this.corpo[0];
       for (let i = 1; i < this.corpo.length; i++) {
           if (cabeca.x === this.corpo[i].x && cabeca.y === this.corpo[i].y) {
               return true;
           }
       }
       return false;
   }
   
   
   verificarColisaoComBorda() {
       const cabeca = this.corpo[0];
       if (cabeca.x < 0 || cabeca.x >= canvas.width || cabeca.y < 0 || cabeca.y >= canvas.height) {
           return true;
       }
       return false;
   }

   
   desenhar() {
       this.corpo.forEach((parte, index) => {
           const cor = index === 0 ? 'green' : 'darkgreen'; // Cabeça da cobra é verde, corpo é verde escuro
           new Entidade(parte.x, parte.y, this.largura, this.altura, cor).desenhar();
       });
   }
}

class Comida extends Entidade {
   constructor() {
       super(Math.random() * canvas.width - 10, Math.random() * canvas.height - 10, 20, 20, 'red');
   }
}

const cobra = new Cobra(100, 200, 20, 20);
const comida = new Comida();


let pontuacao = 0;
let pontuacaoMaxima = localStorage.getItem('pontuacaoMaxima') || 0;


function loop() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   cobra.atualizar();
   cobra.verificarColisao(comida);
   if (cobra.verificarColisaoComBorda() || cobra.verificarColisaoComCorpo()) {
     
       alert("Game Over! Sua pontuação foi " + pontuacao);
       pontuacao = 0; 
       localStorage.setItem('pontuacaoMaxima', Math.max(pontuacaoMaxima, pontuacao));
       location.reload(); 
   }


   if (cobra.comer) {
       pontuacao++;
       cobra.comer = false;
   }
   if (pontuacao > pontuacaoMaxima) {
       pontuacaoMaxima = pontuacao;
       localStorage.setItem('pontuacaoMaxima', pontuacaoMaxima);
   }

   
   ctx.fillStyle = 'white';
   ctx.font = '20px Arial';
   ctx.fillText('Pontuação: ' + pontuacao, 10, 30);
   ctx.fillText('Máxima: ' + pontuacaoMaxima, 10, 60);

 
   cobra.desenhar();
   comida.desenhar();
   
   requestAnimationFrame(loop);
}


document.addEventListener('keydown', (e) => {
   if (e.code === 'KeyW' && cobra.direcao !== 'S') cobra.direcao = 'W';
   if (e.code === 'KeyS' && cobra.direcao !== 'W') cobra.direcao = 'S';
   if (e.code === 'KeyA' && cobra.direcao !== 'D') cobra.direcao = 'A';
   if (e.code === 'KeyD' && cobra.direcao !== 'A') cobra.direcao = 'D';
});

loop();
