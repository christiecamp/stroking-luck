const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
// const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const adventure = express();
const PORT = process.env.PORT || 3013;

// Create the Handlebars.js engine object with custom helper functions
const hbs = exphbs.create({ defaultLayout: 'main' });

const sess = {
  secret: process.env.SECRET,
  cookie: {
    maxAge: 20000000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

adventure.use(session(sess));
// Inform Express.js which template engine we're using
adventure.engine('handlebars', hbs.engine);

adventure.set('view engine', 'handlebars');

adventure.use(express.json());
adventure.use(express.urlencoded({ extended: true }));
adventure.use(express.static(path.join(__dirname, 'public')));

adventure.use(routes);

sequelize.sync({ force: false }).then(() => {
  adventure.listen(PORT, () => console.log(`
=============================================================================
************************ STROKE YOUR LUCK'S BACK END ************************          
=============================================================================                           
  
                                                 _   __,----'~~~~~~~~~'-----.__
                                          .  .    '//====-              ____,-'~'
                          -.            L_L// .   /||;;  '~~~~'---.___./
                    ______-==.       _-~o  ';/    |||  ;;           _,''
              __,--'   ,=='||l=_    ;_,_,/ _-'|-   |';   ll        ,'
           _-'      ,='    | ll'.    '',/~7  /-   /  ||   'l.     /
         .'       ,'       |  ll  ;_  "  /  /-   /   ||      l   /
        / _____  /         |     ll.'-_/  /|- _/   ,||       l /
       ,-'     '-|--'~~'--_ ;     '==-/  '| ;'--===-'       _/'
                 '         '-|      /|    )-';~'      _,--"'
                             '-~^l_/ |    |   ';_   ,^             /.
                                  /  l     l__   ;/~               'l__
                              _,-' _/'; ,-'~____-''-/                 ''===l
                             ((->/'    ;|||' '.     ';.  ,                _||
               ./                       ;_     ';      '~---|__i__i__l--~'_/
              <_n_                     __-^-_    ')  l-.______________,-~'
               'B'l)                  ///,-'~'__--^-  |-------~~~~^'
               /^>                           ///,--~'-.
              '  ' 
  join the adventure:
  http://localhost:${PORT}`));
});
