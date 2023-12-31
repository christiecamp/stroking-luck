const withAuth = require('../../utils/auth');
const router = require('express').Router();
const { StoryLine, User, Story } = require('../../models');

//Create new story-line
router.post('/start', withAuth, async (req, res) => {
  const title = req.body.title;
  const story_line = `Let's get started!`;
  try {
    const storyData = await StoryLine.create({
      title,
      story_line,
      user_id: req.session.user_id,
      story_id: 1,
    });

    res.status(200).json(storyData);
  } catch (error) {
    res.status(400).json(error);
  }
  console.log(`
  =====================================================================
  ************************ STORY LINE CREATED! ************************
  =====================================================================                                                                                           
                           _                        //
                        ,-'_'----,_                //
                       (  _~d~~_/ '~-----,        //
                       (_<_~~~~_,----==='        //
                  __    /  ~~~~=--~~~~          //
                 /  ;   |   /~~                //
                 l_ |   l   l                 //
                 (_ |    l   l_              //
                   L|     l_   l_           //
                   ||       l_   l_        //
               _____U         l_   l_     //
              |  __ l           l_   l_  //
              |  l_l_|            l_   l//
              |______|              l_ //_
              |_______;               //  l
               |  |    '             //l   l
               |  |     '-_         //  |   l
               |  '-,_ / / ,-______//   |__  l
               l----  '-/_/ /||||_  ~),-   ~--l
                ~l_      /-/_'~~~/l_)/_/       ~l
           _       l_   /  / /~~/ /-__ '-/_  ,   |
         _/ ),--,    l_/  /  | / //   -,__ '/_ | |
        /   ',-, |,_   l_/  / / //    /   l  l// |
       /      _)    )-~~(   |/ /_Z--_/_   /    '/
      |  /    _~) /~    -'--/ /~ l   l ~-/      |
      | /    ' ~,,--,  (   / /'l__l_--~~~      |
      l|        /      )  / /~~              _/
        l_            / _/ /          l    _/
          l          | // /            | _/
           '-__/     |// /            /_-
              '--,__/ / /          __--
                 _-' / /       __--
              _-'   / /    __--
           _-'     / / __-- --___
        _-'   ___-/ /--  ~~~---__'--,___
      _/   __/,--/ /,--,--_____ _~'-----'-----,
   ,-~ __,- _//_/ //__/__/_/_/_//~~~~--r-,.l  )
  |   /  _/~,/ / /             ~~~~~~~~'-') | (
  l_,| ./ ,'  / /                       (~  o  )
  |_,|~|_/   / /                         ) _  /
  (_,|~||   / /                          |/ )/
  (_// /|  / /                           / /
  | | ||  / /                            |/
  / | || / /
 /  | ||/ /
(_ | ,'/ /
( '/ ||l/ 
 l/ | l_
 |  l_  '_
  l ,-,l,-,',
   ;_;_;;; ; ;
    ~~~~~~~~~~~
  `);
});

//TODO: Update story-line as choices are made
router.put('/update/:id', withAuth, async (req, res) => {
  console.log(req.body);
  try {
    await StoryLine.update(
      {
        ...req.body,
        user_id: req.session.user_id,
      },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({ message: 'Story saved!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete story-line if user wants to delete from their dashboard

//Delete Post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const storyData = await StoryLine.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!storyData) {
      res.status(404).json({ message: 'No Story found with this id!' });
      return;
    } else {
      res.status(200).json(storyData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
  console.log(`
=====================================================================
********************** STORY LINE WAS REMOVED ***********************
=====================================================================
              llllllllllllllllllllllllllllllllllllll                      
               llllllllllllllllllllllllllllllllllll                       
                  llllllllllllllllllllllllllllllll                        
                    lllllllllllllllllllllllllllll                          
                       lllllllllllllllllllllllll                          
                          lllllllllllllllllllll                             
                             lllllllllllllllll                              
                               llllllllllllll                               
                                llllllllllll                                
                               llllllllllll                                 
                              llllllllllll                                  
                             llllllllllll                                   
                            llllllllllll                                    
                           llllllllllll                                     
                           lllllllllll                                      
                          llllllllllll                                      
                    '     llllllllllll      '                        
                      *     llllllllllll  *   *                            
              '    *    *     llllllllllll   *  *   '                      
                      *   *     llllllllll  *                              
                      '    *   * lllllllll *   *   '                        
                   '    '     *  llllllll   *   '_____                      
                         ; ; ; * lllllll  * /  /:''''':                    
                       . ' ' ;  llllll  / / / /  :''''':                    
                     ; ' ; ' ' llllll / / / / |[] | [] |
  `);
});

//!TESTING
router.get('/:id', withAuth, async (req, res) => {
  try {
    const storyData = await StoryLine.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
          exclude: ['password'],
        },
        {
          model: Story,
          attributes: ['id'],
        },
      ],
    });
    const storyline = storyData.get({ plain: true });
    res.json(storyline);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//!TESTING
router.get('/', withAuth, async (req, res) => {
  try {
    const storyData = await StoryLine.findAll(
      { where: { user_id: req.session.user_id } },
      {
        include: [
          {
            model: User,
            attributes: ['id', 'username'],
            exclude: ['password'],
          },
          {
            model: Story,
            attributes: ['id'],
          },
        ],
      }
    );

    // const storyline = storyData.get({ plain: true });
    res.json(storyData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
