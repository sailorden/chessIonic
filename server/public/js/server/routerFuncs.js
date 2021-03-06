var sys = require('sys')
var exec = require('child_process').exec;

var initRouter=function(router,app){
        
        
    router.use(function(req, res, next) {
       
        next(); // make sure we go to the next routes and don't stop here
    });



    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });   
    });

    app.use('/api', router);


    router.route('/env').get((req, res) => {
        console.log('ENV REQUEST, sending:', process.env)
        res.json(process.env)
    })

    router.route('/log').get((req, res) => {
        var toSend = log || {error: 'no log present'}
        console.log('LOG REQUEST, sending:', toSend)
        res.json(toSend)
    })

    router.route('/adminLogin').post((req, res) => {
        res.json({mock:1})
    })

    router.route('/mod/type').get(function(req,res){
        
        var sendMod=clients.getMod(req.query.id)
        
        if(sendMod=='default'){
            res.json(serverGlobals.defaultMod)
        }else{
            res.json(sendMod)
        }
        
        
        
    })

    router.route('/mod/limits').get(function(req,res){
        
        var modLimits=serverGlobals.getModLimits(req.query.mod)
        
        
        
        res.json(modLimits)
        
        
    })
    
    router.route('/mod/pendingGame').get(function(req,res){
        
        
        dbFuncs.query('learningStats',{
            currentStatus:'inactive'
        },function(learningStats,saverFunc){
            
            var i=learningStats.length
           
            console.log(i,'inactive game(s) found')
            
            var sendGame=learningStats[0]
            if(sendGame){
                
                
                sendGame.currentStatus='active'
                
                var sendModGame=(sendGame.wModGame.status=='in progress')?sendGame.wModGame:sendGame.bModGame
            
                saverFunc([0],function(index){
                    res.json(sendModGame)
                })
                
            }else{
                    res.json({noPending:true})
            }
           
            
        })
        
        
        
        
    })
    
    
    router.route('/mod/stats').get(function(req,res){
        
        
            dbFuncs.query('learningStats',{},function(learningStats){
                
                var toSend=[]
                
                learningStats.forEach(function(stat){
                    
                    if(stat.finalResult.modType){
                        
                       toSend.push([//stat.finalResult.modType,
                                    stat.finalResult.modConst,
                                    //stat.finalResult.modConst,
                                    1500*stat.finalResult.winScore,
                                    50*stat.finalResult.pieceScore,
                                    stat.finalResult.moveCountScore,
                                    
                                    500*stat.finalResult.winScore+
                                    50*stat.finalResult.pieceScore+
                                    stat.finalResult.moveCountScore,
                                    
                                    
                                    //stat.finalResult.modConst
                                    
                        ])//,
                        
                        
                }
                    
                    
                
            })
            
            
            res.json(toSend)
            
        })
        
    
    })
    
    
        
    router.route('/chessApp.apk').get(function(req,res){
        
        
            // dbFuncs.listCollections(function(collInfos){
                

            fs.readFile('../platforms/android/build/outputs/apk/android-debug.apk', function(err, result) {
         
            if (err) res.status(500).json(err)
            
            res.send(result)
            
        })
        
    
    })
        


        
    router.route('/buildApp').get(function(req,res){
        res.writeHead(200, {"Content-Type":"text"});
        var running = true
        function sendDot() {
            if (running) {
                res.write('.')
                setTimeout(sendDot, 1000);
            }
        }
        sendDot()

        exec("cd .. && sudo docker run -it --rm --privileged -v /dev/bus/usb:/dev/bus/usb -v $PWD:/src cordova cordova build", function (error, stdout, stderr) {
            running = false
            sys.print('stdout: ' + stdout);
            sys.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            res.write(stdout)
            res.end()
            });
            
    })
        


    router.route('/runCommand/:command').get(function(req,res){
        res.writeHead(200, {"Content-Type":"text"});
        var running = true
        function sendDot() {
            if (running) {
                res.write('.')
                setTimeout(function(){ sendDot() }, 500);
            }
        }
        sendDot()

        exec(req.params.command, function (error, stdout, stderr) {
            running = false
            // res.write('stdout: ' + stdout);
            if (stderr) res.write('stderr: ' + stderr);
            if (error !== null) {
                res.write(JSON.stringify({message: error.message, stack: error.stack}));
            }
            res.write(stdout)
            res.end()
            });
            
    })
        

    router.route('/db/query').post(function(req,res){
        
        
            // dbFuncs.listCollections(function(collInfos){
                

            dbFuncs.query(req.body.collection, req.body.query, function(queryResult) {
         
            
            
            res.json(queryResult)
            
        })
        
    
    })
        
    router.route('/db/collections').get(function(req,res){
        
        
            dbFuncs.listCollections(function(collInfos){
                
            
            
            res.json(collInfos)
            
        })
        
    
    })


    router.route('/db/collection/:name').get(function(req,res){
        
        
            dbFuncs.query(req.params.name, {}, function(collInfos){
                
            
            
            res.json(collInfos)
            
        })
        
    
    })
    
    
    router.route('/mod/stats/:modType').get(function(req,res){
        
        var modType=req.params.modType
        
        dbFuncs.query('learningStats',{modType:modType},function(learningStats){
                
            var toSend=[]
                 
                        
            learningStats.forEach(function(stat){
                    
                if(stat.finalResult.modType){
                        
                        toSend.push([//stat.finalResult.modType,
                                    stat.finalResult.modConst,
                                    //stat.finalResult.modConst,
                                    1500*stat.finalResult.winScore,
                                    50*stat.finalResult.pieceScore,
                                    stat.finalResult.moveCountScore,
                                    
                                    500*stat.finalResult.winScore+
                                    50*stat.finalResult.pieceScore+
                                    stat.finalResult.moveCountScore,
                                    
                                    
                                    //stat.finalResult.modConst
                                    
                                    
                        ])//,
                                    //stat.finalResult.modType])
                        
                        
                }
                    
                    
                    
            })
            
            
            
            res.json(toSend)
            
        })
    
      
        
        
    })
    
    
    
    
    
    
    
        
    router.route('/modGame').post(function(req,res){
        
        var dbTable=req.body
        
        var learningOn=dbTable.learningOn
        var connectionID=dbTable.connectionID
        
        
        if(dbTable._id==-1){
            //new game
            
            startGame(dbTable.wName, dbTable.bName, {}, true,function(initedTable){
                
                dbTable=initedTable
                
                dbTable.learningOn=learningOn
                dbTable.connectionID=connectionID
                
                //console.log('@@@@',dbTable.bName)
                
                dbTable.wModGame=(dbTable.bName=='standard')?true:false
                
                res.json({_id:dbTable._id})
                
                serverGlobals.learning.add(dbTable,connectionID)
                
            })
          
        }else{
            
            //could update game here
            
            res.json({
                result:serverGlobals.learning.newLearnerForOldGame(dbTable,connectionID)
            })
            
        }
      
    })
    
}