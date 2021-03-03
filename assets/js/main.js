//snake
var canvas = document.getElementById('zone');
var ctx = canvas.getContext('2d');

//dilmension snake
var largeur=20;
var  hauteur =20;

 //spawn aleatoire du snake
var x = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
var y= Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;

 //deplacement futur
var depX=0;
var depy=0;

//la queue du snake
var queue=[];
var taillequeue=5;
var tailleinitqueue=5;
var upqueue=1;
var taillemaxqueue=100000000; // Cette valeur sera changé plus tard

//variable supp
var hist;
var boucle = 0;
var sautBoucle = 10;
var timeout = 0;
var collisionqueue = false;


//spawn pomme random
var Xpomme=Math.trunc(Math.random()*canvas.width/largeur)*largeur;
var Ypomme=Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
var Rpomme = 10;

 //variable vie
 var vie=5;

//varaible du score
var score = 0;

//interval du jeu
 var gameinterval = setInterval(game,100);

 //écouteur d'event clavier
document.addEventListener("keydown",keyboard);

//window.onload=function() {}


//fonction principale du jeu
function game(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    //forme et couleur du snake
    ctx.fillRect(x, y, largeur, hauteur);
    ctx.fillStyle="#8B0000";

    //valeur deplacement
    x+=depX*largeur;
    y+=depY*hauteur;

   // augmentation de al taille toute les 100 boucles (chaques secondes quoi)
    if((taillequeue <= taillemaxqueue) && ((depX != 0) || (depY!=0))){
        if((boucle++)%100 == 1){
            sautBoucle--;
            if(sautBoucle<0){
                taillequeue+=upqueue;
            }
        }
    }
    //on fout les valeur dans le tableau créé plus haut
    queue.push({x:x,y:y});

    //vidange du tableau
    if(typeof queue[1].x != 'undefined') {
        if(queue[0].x == queue[1].x && queue[0].y == queue[1].y){
            queue.shift();
        } 
    }
    // tant que la taille dépasse la taille max
    while(queue.length>taillequeue){

    // on supp un un element à la fin
    queue.shift();
    }

   
    for(var i=0;i<queue.length;i++) {
        ctx.fillRect(queue[i].x,queue[i].y, largeur, hauteur); 
        //si on veut que se soit découper en petit carré
    
        /*  ctx.fillRect(queue[i].x,queue[i].y, largeur-3, hauteur-3);*/ 
    }

    // collision pomme
    if(x==Xpomme && y==Ypomme){
        score+=10 + 2 * ((taillequeue - tailleinitqueue)/upqueue); 
    


    // nouveau placement pomme
    Xpomme=Math.trunc(Math.random()*canvas.width/largeur)*largeur;
    Ypomme=Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;  

    taillequeue= taillequeue+upqueue;
    timeout = 0; 
    
    }else if(timeout++ > 200) { // 20 secondes
        timeout = 0;
       
       Xpomme=Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        Ypomme=Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
    }

    //affichage pomme
    ctx.beginPath();
    ctx.arc(Xpomme+Rpomme, Ypomme+Rpomme,Rpomme, 0, Math.PI * 2);
    ctx.fillStyle="#32CD32";
    ctx.fill();
    ctx.closePath();

    // Affichage du score
    ctx.font = '16px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, 5, 20);


    //reflet sur la pomme

    // on doit sauvegarder le contexte initial
    ctx.save();

    // changement de la taille du ctx horizontal
    ctx.scale(1, 1.5);

    //on dessine le reflet 
    //on divise par 1.5 poour reprendre le ctx de base
    ctx.beginPath();
    ctx.arc(Xpomme+Rpomme + 3, (Ypomme+Rpomme)/1.5,Rpomme/3, 0, Math.PI * 2);
    ctx.fillStyle="#7bfc09";
    ctx.fill();
    ctx.closePath();

    // on reprend le ctx d'origine
    ctx.restore();

    //TRAITEMENT des vie

    // Affichage des vies1
    ctx.font = '16px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Vies restante: ' + vie, canvas.width - 130, 20);

    //detectiuon de la collision murale
    if(x<0 || x>canvas.width || y<0 || y > canvas.height){
        // perte de vie
        timeout = 0;
        // suppresion des valeur de la queue
        while(queue.length>1){
        // suppression de la queue
        queue.shift();
        }
        // respawn du snake au pif
        x = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        y= Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;

        // retour à la longueur initiale
        taillequeue=tailleinitqueue;

        // respawn de la pmme au pif
        Xpomme=Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        Ypomme=Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;

        //diminution du nombre de vie
        vie--;

        // game over 
        if(vie == 0){
        ctx.font = '40px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('GAME OVER', canvas.width / 2 - 130, canvas.height / 2);
        document.getElementById('game-over').play();
        clearTimeout(gameinterval);
        }
    }

    //collision sur la queue
    if(queue.length>5){
        for(i=0;i<queue.length-1;i++) {
       // la position lenngth - 1 est celle de la tête elle n'a pas besoin d'être inclut dans le test avec elle même!
        if(queue[i].x==queue[queue.length-1].x && queue[i].y==queue[queue.length-1].y){
        collisionqueue= true;
        break;
        }
        }
       
       }
       
       // On vérifie si collision == true
       if(x < 0 || x > (canvas.width - largeur) || y < 0 || y > (canvas.height - hauteur) || collisionqueue == true){
        // si oui=perte de vie
        timeout = 0;
        // reset de la valeur sauvegarder
       
        queue = [];
        // respawn au pif du snake
        x = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        y= Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
        queue.push({x:x,y:y});
        //taille initiale
        taillequeue=tailleinitqueue;
        //repsawn aleatoire de la pomme
        Xpomme=Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        Ypomme=Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
        // decrementation de la vie
        vie--;
        // on redéfinie collision en false
        collisionqueue=false;
        }

        // game over
        if(vie == 0){
        ctx.font = '40px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('GAME OVER', canvas.width / 2 - 130, canvas.height / 3);
        ctx.fillText('press escap to replay', canvas.width / 2 - 130, canvas.height / 2+130);
        ctx.fillText('your score is '+score, canvas.width/2-130, canvas.height/2);
        clearTimeout(gameinterval);
        } 


}


function keyboard(evt){
    switch(evt.keyCode) {
     // touche gauche
     case 81:
        if(hist==68){break;}
        depX=-1;
        depY=0;
        hist=evt.keyCode;
    break;
    // touche haut
    case 90:
        if(hist==83){break;}
        depX=0;
        depY=-1;
        hist=evt.keyCode;
    break;
    // touche droite
    case 68:
        if(hist==81){break;}
        depX=1;
        depY=0;
        hist=evt.keyCode;
    break;
     // touche bas
    case 83:
        if(hist==90){break;}
        depX=0;
        depY=1;
        hist=evt.keyCode;
    break;
      // touche espace
      case 32:
        depX=0;
        depY=0;
    break;
    // touche echap
    case 27:
        clearTimeout(gameinterval);
        // réinitialisation des valeur
        x= Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        y= Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
        queue=[];
        queue.push({x:x,y:y});
        taillequeue=tailleinitqueue;
        upqueue=1;
        depX=0;
        depY=0;
        boucle = 0;
        Xpomme=Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        Ypomme=Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
        score = 0;
        vie = 5;
        timeout = 0;
        collisionqueue = false;
        gameinterval = setInterval(game,100);
        break;
    }
   }


   //si l'on fait faire un snake ou la pomme reduit et ralenti la croissance
   /* // on enlève un saut si la taille à upper
        if(tailleTrace>tailleinitqueue){
        tailleTrace-=upqueue;
        }
    //reinitialisation du decompte d'expansion
    sautBoucle=10;*/