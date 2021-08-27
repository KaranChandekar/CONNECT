import React,{ useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'

import firebase from "firebase"
import "firebase/database";


import '../style/style.css'
import Button from '@material-ui/core/Button'
import { CircularProgress, Chip } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel, FormControl } from '@material-ui/core'

import { QuestionAnswerRounded, FilterNoneRounded, FileCopyRounded, AccountCircle } from '@material-ui/icons';

import { toast } from 'react-toastify';

import Placeholder from '../img/quizCoverPlaceholder.svg'

//components

export default function BrowseQuizes({match}) {

    const [gameMode, setGameMode] = useState("")

    useEffect(() => {
        setGameMode(match.params.gamemode)
        console.log(match.params.gamemode)
        if(match.params.gamemode === 'multi'){
            GetMulti()
        }
        if(match.params.gamemode === 'normal'){
            GetQuizes()
        }
    }, [])

    //styles
    const newQuizStyle = {backgroundColor:'white', borderRadius:'25px'}

    const GetQuizes = () => {

        console.log('normal')
        ReactDOM.render(null, document.getElementById('feed'))
        var db = firebase.database().ref('quizes/')

        
        // Attach an asynchronous callback to read the data at our posts reference
        db.on("value", function(snapshot) {
          var data = snapshot.val();
          var keys = Object.keys(data);
          keys.map((key, index)=>{
            var k = keys[index]

            let newQuiz = document.createElement('div')
            newQuiz.id = `newQuiz${index}`
            newQuiz.className = 'newQuiz'
            document.getElementById('feed').appendChild(newQuiz)

            ReactDOM.render(
                <div style={{overflowY:'scroll', overflowX:'hidden'}}>
                    <img style={{width:'100%', height:'300px'}} src={data[k].coverImg || Placeholder} alt='cover-img'/>
                    <h2>{data[k].name}</h2>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                         {
                            data[k].userProfilePic == undefined ?
                            <AccountCircle style={{marginRight:'10px'}} color='primary'/>
                            :
                            <img 
                                width='25px' 
                                height='25px' 
                                src={data[k].userProfilePic} 
                                alt={data[k].userProfilePic}
                                style={{
                                    borderRadius:'100%',
                                    marginRight:'10px'
                                }}
                            />                       
                         }
                        <h3>{`by ${data[k].userName}`}</h3>
                    </div>
                    <h2>Game Code</h2>
                    <h2>{k}⠀<FileCopyRounded onClick={()=>{copyCode(k)}} color='primary'/></h2>
                    <div>
                        {
                            data[k].tags == undefined ?
                            null
                            :
                            <div>
                                {
                                    data[k].tags.map((tag,index)=>{
                                        return <Chip style={{margin:'5px'}} key={tag+index} label={tag} color="primary" />
                                    })
                                }
                            </div>
                        }
                    </div>
                    <Button style={{marginBottom:'10vh'}} variant="contained" color="primary" size='small' onClick={()=>{viewMore(`newQuiz${index}Div`)}}>View More</Button>
                    <div id={`newQuiz${index}Div`} hidden>
                        <h1>Questions</h1>
                        <div>
                        <h3>{data[k].q0.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q0.answer}>{data[k].q0.answer}</h3>
                        <Button id={(data[k].name)+'q1'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q0.answer, (data[k].name)+'q1')}}>REVEAL ANSWER</Button>
                        </div>
                        <h3>{data[k].q1.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q1.answer}>{data[k].q1.answer}</h3>
                        <Button id={(data[k].name)+'q2'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q1.answer, (data[k].name)+'q2')}}>REVEAL ANSWER</Button>
                        <div>
                        <h3>{data[k].q2.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q2.answer}>{data[k].q2.answer}</h3>
                        <Button id={(data[k].name)+'q3'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q2.answer, (data[k].name)+'q3')}}>REVEAL ANSWER</Button>
                        </div>
                        <div>
                        <h3>{data[k].q3.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q3.answer}>{data[k].q3.answer}</h3>
                        <Button id={(data[k].name)+'q4'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q3.answer, (data[k].name)+'q4')}}>REVEAL ANSWER</Button>
                        </div>
                        <div>
                        <h3>{data[k].q4.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q4.answer}>{data[k].q4.answer}</h3>
                        <Button id={(data[k].name)+'q5'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q4.answer, (data[k].name)+'q5')}}>REVEAL ANSWER</Button>
                        </div>
                        <div>
                        <h3>{data[k].q5.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q5.answer}>{data[k].q5.answer}</h3>
                        <Button id={(data[k].name)+'q6'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q5.answer, (data[k].name)+'q6')}}>REVEAL ANSWER</Button>
                        </div>
                        <Button style={{marginBottom:'10vh'}} variant="contained" color="secondary" size='small' onClick={()=>{viewLess(`newQuiz${index}Div`)}}>View Less</Button>
                    </div>
                </div>,
                document.getElementById(`newQuiz${index}`)
            )
            // document.getElementById('loading').setAttribute('hidden', 'true')
          })
          
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    }

    const GetMulti = () => {

        console.log('multi')
        ReactDOM.render(null, document.getElementById('feed'))
        var db = firebase.database().ref('multiQuizzes/')
        
        // Attach an asynchronous callback to read the data at our posts reference
        db.on("value", function(snapshot) {
          var data = snapshot.val();
          var keys = Object.keys(data);
          keys.map((key, index)=>{
            var k = keys[index]

            let newQuiz = document.createElement('div')
            newQuiz.id = `newQuiz${index}`
            newQuiz.className = 'newQuiz'
            document.getElementById('feed').appendChild(newQuiz)

            ReactDOM.render(
                <div style={{overflowY:'scroll', overflowX:'hidden'}}>
                    <img style={{width:'100%', height:'300px'}} src={data[k].coverImg || Placeholder} alt='cover-img'/>
                    <h2>{data[k].name}</h2>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                        {
                            data[k].userProfilePic == undefined ?
                            <AccountCircle style={{marginRight:'10px'}} color='primary'/>
                            :
                            <img 
                                width='25px' 
                                height='25px' 
                                src={data[k].userProfilePic} 
                                alt={data[k].userProfilePic}
                                style={{
                                    borderRadius:'100%',
                                    marginRight:'10px'
                                }}
                            />                       
                         }
                        <h3>{`by ${data[k].userName}`}</h3>
                    </div>
                    <h2>Game Code</h2>
                    <h2>{k}⠀<FileCopyRounded onClick={()=>{copyCode(k)}} color='primary' /></h2>
                    <div>
                        {
                            data[k].tags == undefined ?
                            null
                            :
                            <div>
                                {
                                    data[k].tags.map((tag,index)=>{
                                        return <Chip style={{margin:'5px'}} key={tag+index} label={tag} color="primary" />
                                    })
                                }
                            </div>
                        }
                    </div>
                    <div>
                        {Object.keys(data[k].steps).map((stp, i)=>{
                            return (
                                <>
                                    <h2>{Object.keys(data[k].steps)[i]}</h2>
                                    <div>
                                        {
                                            Object.keys(data[k].steps[Object.keys(data[k].steps)[i]]).map((quest, indx) => {
                                                console.log(data[k].steps[Object.keys(data[k].steps)[i]][quest])
                                                return(
                                                    <div>
                                                        <h4>{data[k].steps[Object.keys(data[k].steps)[i]][quest].question}</h4>
                                                        <h4>{data[k].steps[Object.keys(data[k].steps)[i]][quest].answer}</h4>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>,
                document.getElementById(`newQuiz${index}`)
            )
            // document.getElementById('loading').setAttribute('hidden', 'true')
          })
          
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    }

    const revealAns = (ans, button) =>{
        document.getElementById(ans).style.visibility = "visible"
        document.getElementById(button).style.visibility = "hidden"
        console.log(ans)
    }
    const hideAns = (ans) =>{
        document.getElementById(ans).setAttribute('hidden', true)
    }
    const viewMore = (divId) => {
        document.getElementById(divId).hidden = false
    }
    const viewLess = (divId) =>{
        document.getElementById(divId).hidden = true
    }

    const changeGamemode = (event) => {
        event.preventDefault();
        setGameMode(event.target.value);
        if(event.target.value === 'normal'){
            window.location = '/browsequizzes/normal'
        }
        if(event.target.value === 'multi'){
            window.location = '/browsequizzes/multi'
        }
    }

    const copyCode = (code) => {
        var text = code;
        navigator.clipboard.writeText(text).then(function() {
          toast.success('Copied the code!');
        }, function(err) {
          toast.error('Could not copy the code: ', err);
        });
    }
//console.log(Object.keys(data[k].steps[Object.keys(data[k].steps)[i]]))


    return (
        <>  
        <div style={{width:'100%', display:'flex', justifyContent:'flex-start',backgroundColor:'white', alignItems:'center', border:'2px solid black', boxShadow:'10px 10px 0 #262626', padding:'10px'}}>
            <h1 style={{fontSize:'1.5rem', marginRight:'20px'}}>Explore Content</h1>
            <FormControl variant='outlined'>
                <InputLabel id="demo-simple-select-outlined-label">Game Mode</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={gameMode}
                        onChange={changeGamemode}
                        label="GameMode"
                        style={{width:'180px', height:'40px'}}
                        required
                        >
                        <MenuItem value='normal'><QuestionAnswerRounded color='primary'/>⠀Normal</MenuItem>
                        <MenuItem value='multi'><FilterNoneRounded color='primary'/>⠀Multi</MenuItem>
                    </Select>
            </FormControl>
        </div>
        <div style={{marginTop:'100px'}} id='feed'>
            <div style={{display:'flex', alignItems:'center'}}>
                <h1 id='loading'><span style={{color:"white"}}>Loading</span>⠀<CircularProgress size={40} style={{color:'white'}} /></h1>
            </div>
        </div>
        </>
    )
}


/*
                    <div>
                        <h1>Questions</h1>
                        <div>
                        <h3>{data[k].q0.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q0.answer}>{data[k].q0.answer}</h3>
                        <Button id={(data[k].name)+'q1'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q0.answer, (data[k].name)+'q1')}}>REVEAL ANSWER</Button>
                        </div>
                        <h3>{data[k].q1.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q1.answer}>{data[k].q1.answer}</h3>
                        <Button id={(data[k].name)+'q2'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q1.answer, (data[k].name)+'q2')}}>REVEAL ANSWER</Button>
                        <div>
                        <h3>{data[k].q2.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q2.answer}>{data[k].q2.answer}</h3>
                        <Button id={(data[k].name)+'q3'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q2.answer, (data[k].name)+'q3')}}>REVEAL ANSWER</Button>
                        </div>
                        <div>
                        <h3>{data[k].q3.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q3.answer}>{data[k].q3.answer}</h3>
                        <Button id={(data[k].name)+'q4'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q3.answer, (data[k].name)+'q4')}}>REVEAL ANSWER</Button>
                        </div>
                        <div>
                        <h3>{data[k].q4.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q4.answer}>{data[k].q4.answer}</h3>
                        <Button id={(data[k].name)+'q5'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q4.answer, (data[k].name)+'q5')}}>REVEAL ANSWER</Button>
                        </div>
                        <div>
                        <h3>{data[k].q5.question}</h3>
                        <h3 style={{visibility:'hidden'}} id={data[k].q5.answer}>{data[k].q5.answer}</h3>
                        <Button id={(data[k].name)+'q6'} style={{marginBottom:'1vh'}} variant="contained" color="primary" size='small' onClick={()=>{revealAns(data[k].q5.answer, (data[k].name)+'q6')}}>REVEAL ANSWER</Button>
                        </div>
                    </div>*/