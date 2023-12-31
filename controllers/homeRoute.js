const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Story, StoryLine } = require('../models');

router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/home');
      return;
    }
    res.render('landingpage', { logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/home', async (req, res) => {
  try {
    res.render('homepage', { logged_in: req.session.logged_in });
    console.log(`
=====================================================================
******************* STROKE YOUR LUCK'S HOMEPAGE *********************
=====================================================================
                                ==(W{==========-      /===-                        
                                  ||  (.--.)         /===-_---~~~~~~~~~------____  
                                  | L_,|**|,__      |===-~___                _,-' 
                     -==;;        'L ' '--'   ),    '//~ll   ~~~~'---.___.-~~      
                 ______-==|        /'L_. .__/l l    | |  ll           _-~'         
           __--~~~  ,-/-==;;      (   | .  |~~~~|   | |   'l        ,'             
        _-~       /'    |  ;;     )__/==0==-l<>/   / /      l      /               
      .'        /       |   ;;      /~l___/~~l/  /' /        l   /'                
     /  ____  /         |    ;';.__/-~~   L  |_/'  /          l/'                  
    /-'~    ~~~~~---__  |     ~-/~         ( )   /'        _--~'                   
                      l_|      /        _) | ;  ),   __--~~                        
                        '~~--_/      _-~/- |/ l   '-~ l                            
                       {l__--_/}    / ll_>-|)<__l      l                           
                       /'   (_/  _-~  | |__>--<__|      |                          
                      |   _/) )-~     | |__>--<__|      |                          
                      / /~ ,_/       / /__>---<__/      |                          
                     o-o _//        /-~_>---<__-~      /                           
                     (^(~          /~_>---<__-      _-~                            
                    ,/|           /__>--<__/     _-~                               
                 ,//('(          |__>--<__|     /                  .----_          
                ( ( '))          |__>--<__|    |                 /' _---_~l        
             '-)) )) (           |__>--<__|    |               /'  /     ~l'l      
            ,/,'//( (             l__>--<__l    l            /'  //        ||      
          ,( ( ((, ))              ~-__>--<_~-_  ~--____---~' _/'/        /'       
        '~/  )' ) ,/|                 ~-_~>--<_/-__       __-~ _/                  
      ._-~//( )/ )) '                    ~~-'_/_/ /~~~~~~~__--~                    
       ;'( ')/ ,)(                              ~~~~~~~~~~                         
      ' ') '( (/                                                                   
        '   '  '
    `);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const myStories = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: StoryLine }],
    });

    const stories = myStories.get({ plain: true });
    console.log(stories);
    res.render('dashboard', {
      ...stories,
      logged_in: req.session.logged_in,
    });
    console.log(`
=====================================================================
******************** VIEWING YOUR JOURNEY DASH **********************
=====================================================================
        .                  .-.    .  _   *     _   .
               *          /   .     ((       _/ .       *    .
            _        ..--'l/l_ .     '      /    .  *   ___
        *  / l_    _/ ^      l/l'__        /l/l  /.  __/   l *
          /    .  /    .'   _/  /  l  *' /    l/  ./ .''l_/l   .
         /./l  /./ :' __  ^/  ^/    '--./.'  ^  '-.l _    _:l _
        /    l/  .  _/  .-' __/.' ^ _   l_   .'l   _/ l .  __/ l
       /l  .-   '. ./     . / -.   _/ . -. '_/   l /    '._/  ^  .
      /  '-.__ ^   / .-'.--'    . /    '--./ .-'  '-.  '-. '.  -  '.
    @/        '.  / /      '-.   /  .-'   / .   .'   .    .  .  .-  l%
    @&8jgs@@%% @)&@&(88&@.-_=_-=_-=_-=_-=_.8@% &@&&8(8%@%8)(8@%8 8%@)%
    @88:::&(&8&&8:::::%&;.~-_~~-~~_~-~_~-~~=.'@(&%::::%@8&8)::&#@8::::
    '::::::8%@@%:::::@%&8:'.=~~-.~~-.~~=..~'8::::::::&@8:::::&8:::::'
     '::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::.'
    `);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
  console.log(`
=====================================================================
********************** WELCOME BACK ADVENTURER **********************
=====================================================================

                             ,'.   |.
                            / /.:  ;;
                          / :'|| //
                         (| | ||;'
                         / ||,;'-.._
                        : ,;,'';:.--'
                        |:|''-(..
                        ::: .-'.''
                        ... .,-'.
                          '. '.,-'-._      ,-._
                   ,-.       .  '.,-' '-.  / ,..'.
                  . ,.'.      '.  ; _.-' ;',: ''; ;
                 / / :..'-'''''-)  '.   _.:''  ''; ;
                : :  '' '-..'''/    |-''  |''  '' ; ;
                | |  ''   ''  :     |__..-;''  ''  : :
                | |  ''   ''  |     ;    / ''  ''  | |
                | |  ''   ''  ;    /--../_ ''_ '' _| |
                | |  ''  _;:_/    :._  /-.'',-.'',-. |
                : :  '',;'';/     |_ ,(   ''   ''   .l
                 . .  .(   /.     :,'  .
                  . ..'/  : /    ,)    /
                   . ':   ':    / l   :
                    '.;    :   :l  l  |
                            l  | '. l |..-_
                             ) |.  '/___-.-'
                           ,'  -.'.  '. '        _,)
                           ;';('.; '._ '-..___..-','
                              ''      ''-..___..-'
    `);
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    //TODO insert modal for 'you're already logged in
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
  console.log(`
=====================================================================
******************** WELCOME TO THE ADVENTURE! **********************
=====================================================================
            ,   ,
         ,-'{-'/
      ,-~ , l {-~~-,
    ,~  ,   ,',-~~-,',
  ,'   ,   { {      } }                                             }/
 ;     ,--/'l l    / /                                     }/      /,/
;  ,-./      l l  { {  (                                  /,;    ,/ ,/
; /   '       } } ', '-'-.___                            / ',  ,/  ',/
 l|         ,','    '~.___,---}                         / ,',,/  ,'',;
  '        { {                                     __  /  ,'/   ,',;
           l l                                 _,', '{  '',{   ',';'
       {     } }       /~;         .-:::-.     (--,   ;l ',}  ',';
       ll._./ /      /' , ;      ,:::::::::,     '~;   l},/  ',';     ,-=-
        '-..-'      /. '  .;_   ;:::::::::::;  __,{     '/  ','';     {
                   / , ~ . ^ '~';:::::::::::<<~>-,,',    '-,  '',_    }
                /~~ . '  . ~  , .'~~;:::::::;    _-~  ;__,        ',-'
       /';    /~,  . ~ , '  '  ,  .' ;::::;'   <<<~'''   ''-,,__   ;
      /' .'; /' .  ^  ,  ~  ,  . ' . ~;~                       ll, '',__
     / ' , ,';.  ' ~  ,  ^ ,  '  ~ . . ''~~~',                   '-'--, l
    / , ~ . ~ ; , ' .  ^  '  , . ^   .   , ' .'-,___,---,__            ''
  /' ' . ~ . ' '; '  ~  ,  .  ,  '  ,  . ~  ^  ,  .  ~  , .'~---,___
/' . '  ,  . ~ , ;  '  ~  ,  .  ^  ,  ~  .  '  ,  ~  .  ^  ,  ~  .  '-,

                                               Never Ending Adventures
  `);
});

router.get('/end/:id', withAuth, async (req, res) => {
  try {
    const storyData = await StoryLine.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
          exclude: ['password'],
        },
        {
          model: Story,
          attributes: ['id', 'Option1', 'Option2'],
        },
      ],
    });

    const storyline = storyData.get({ plain: true });
    // console.log(storyline);

    //TODO: replace with new handlebars file after complete
    res.render('endpage', {
      ...storyline,
      logged_in: req.session.logged_in,
    });
    // console.log('boop', res.json(storyline));
    // res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
