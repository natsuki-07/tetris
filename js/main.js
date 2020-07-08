'use strict';
{

  const reset = document.getElementById('reset');
  reset.disabled = true;
  const linescore = document.getElementById('score');


  const btn = document.getElementById('btn');
  let start = btn.addEventListener('click',()=>{
  btn.disabled = true;
  reset.disabled = false;
  reset.addEventListener('click',()=>{
    over=true;
    btn.disabled = false;
    reset.disabled = true;
    btn.textContent = "NEW GAME";
  });
  



  const game_speed = 300; //ミノガ落ちるスピード
  const field_col = 10;
  const field_row = 23;
  
  const block_size = 30;

  const screen_w = block_size*field_col;
  const screen_h = block_size*field_row;
  const tetoro_size= 4;

  let tetoro;

  let can = document.getElementById('can');
  let ctx = can.getContext('2d');

  
  can.width = screen_w;
  can.height = screen_h;
  can.style.border= "4px solid #eee";

  //本体
  const tetoro_colors = [
   "#000",//空
   "#6cf",//1
   "#f92",//2
   "#66f",//3
   "#c5c",//4
   "#fd2",//5
   "#f44",//6
   "#5b5",//7
   "#fff",//8
   "#F525F3",//9

];
  const tetoro_types = [
    [], //0,空
  [          //1,I
   [0,0,0,0],
   [1,1,0,0],
   [0,1,1,0],
   [0,0,0,0],
  ],
 [            //2,L
   [0,0,0,0],
   [1,1,1,1],
   [0,0,0,0],
   [0,0,0,0],
  ],
  [          //3.J
   [0,0,1,0],
   [0,0,1,0],
   [0,1,1,0],
   [0,0,0,0],
  ],
   [         //4.T
   [0,1,0,0],
   [1,1,1,0],
   [0,1,0,0],
   [0,0,0,0],
   ],
   [            //5.o
   [0,0,0,0],
   [0,1,1,0],
   [0,1,1,0],
   [0,0,0,0],
   ],
   [       //6.z
   [0,0,0,0],
   [1,1,0,0],
   [0,1,1,0],
   [0,0,0,0],
   ],
   [       //7.s
   [0,0,0,0],
   [0,0,1,1],
   [0,1,1,0],
   [0,0,0,0],
   ],
   [       //8.
   [0,0,0,0],
   [0,0,1,0],
   [0,1,1,0],
   [0,0,0,0],
   ],
   [       //9
   [0,0,0,0],
   [1,0,1,0],
   [1,1,1,0],
   [0,0,0,0],
   ],
  ];
  const start_x = field_col/2-tetoro_size/2;
  const start_y=0;
  
  let tetoro_t ;



  //テトロミノの座標
  let tetoro_x =start_x; 
  let tetoro_y =start_y; 
  

  
  //フィールド
  let field=[];
  //Gameover
  let over = false;

  tetoro_t = Math.floor(Math.random()*(tetoro_types.length-1))+1;
  tetoro = tetoro_types[tetoro_t];

  init();
  drawAll();


 setInterval(dropTetoro,game_speed);

 
  function init(){
   for(let y=0;y<field_row;y++){
     field[y] =[];
    for(let x=0;x<field_row;x++){
     field[y][x] =0;
       }
     }  
  }

function drawBlock(x,y,c){  //ブロック一つ
  let px = x * block_size;
  let py = y * block_size;

  ctx.fillStyle = tetoro_colors[c];
  ctx.fillRect(px,py,block_size,block_size);
  ctx.strokeStyle = "black";
  ctx.strokeRect(px,py,block_size,block_size);
}
    
//いろいろ描く

//フィールドを描く
function drawAll(){
  ctx.clearRect(0,0,screen_w,screen_h);

for(let y=0; y<field_row; y++){
 for(let x=0; x<field_col; x++){
  if(field[y][x]){
    drawBlock(x,y,field[y][x]);
     }
    }   
  }

    //ミノを描く
    for(let y=0; y<tetoro_size; y++){
      for(let x=0; x<tetoro_size; x++){
        if(tetoro[y][x]){
          drawBlock(tetoro_x+x,tetoro_y+y,tetoro_t);
        
      }       
    }
  }
  if(over){//Gameoverを出す
    let s = "GAME OVER";
    ctx.font="40px'MS ゴシック'";
    let w = ctx.measureText(s).width;
    let x = screen_w/2-w/2;
    let y = screen_h/2-20;
    ctx.lineWidth = 4;
    ctx.strokeText(s,x,y);
    ctx.fillStyle="white";
    ctx.fillText(s,x,y);
    btn.disabled = false;
    reset.disabled = true;
  }
 }
//移動できるかのチェック
function checkMove(mx,my,ntetoro){
  if(ntetoro ===undefined) ntetoro=tetoro;
  for(let y=0; y<tetoro_size;y++){
    for(let x=0; x<tetoro_size;x++){
      
      if(ntetoro[y][x]){
        let nx=tetoro_x + mx + x;
        let ny=tetoro_y + my + y;
        if( ny<0||
            nx<0||
            ny>=field_row||
            nx>=field_col||
            field[ny][nx]) {
        return false;
        }
      }
    }
  }
  return true;
}

//ミノの回転
function rotate(){
  let ntetoro =[];

  for(let y=0; y<tetoro_size;y++){
    ntetoro[y]=[];
    for(let x=0; x<tetoro_size;x++){
      ntetoro[y][x]=tetoro[tetoro_size-x-1][y];
    }
  }
  return ntetoro;

}

//ブロックが落ちる処理
function fixTetoro(){
  
  for(let y=0; y<tetoro_size;y++){
    for(let x=0; x<tetoro_size;x++){
      if(tetoro[y][x]){
        field[tetoro_y+y][tetoro_x+x]=tetoro_t;
      }
    }
  }
}

//ラインが一列そろったかを見る,消す
function checkLine(){
  for(let y=0; y<field_row; y++){
    let lineCount = 0;
      let flag= true;
    for(let x=0; x<field_col; x++){
     if(!field[y][x]){
      flag=false;
      break;
     }
    }

    if(flag){
      lineCount++;  
      for(let ny=y; ny>0; ny--){
        for(let nx=0;nx<field_col;nx++){
          field[ny][nx] = field[ny-1][nx];
         
        }
      }
    }
  }
}


//ミノが落ちる
function dropTetoro(){
  if(over) return;
  if(checkMove(0,1)) tetoro_y++;
  else{
    fixTetoro();
    checkLine();

    tetoro_t = Math.floor(Math.random()*(tetoro_types.length-1))+1;
    tetoro = tetoro_types[tetoro_t];
    tetoro_x=start_x;
    tetoro_y=start_x;
    if(!checkMove(0,0)){
      over=true;
    }
  }
  drawAll();
}

//キーボードが押された時どう動くか
document.onkeydown = function(e){
if(over) return;
  switch(e.keyCode){
    case 37: //左
    if(checkMove(-1,0))tetoro_x--;
      break;
    case 38: //上
    if(checkMove(0,-1))tetoro_y--;
      break;
    case 39: //右
    if(checkMove(1,0))tetoro_x++;
      break;
    case 40: //下
    if(checkMove(0,1))tetoro_y++;
      break;
    case 32: //スペース
    let ntetoro=rotate();
    if(checkMove(0,0,ntetoro)) tetoro = ntetoro;
      break;
  }
 
  drawAll();
}
 }); 
start();
}