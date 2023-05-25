import React, { useState, useEffect } from 'react';
import './questions.css';
import { useParams, Link } from 'react-router-dom';
import { questions } from '../index.js'
import SwitchAround from '../universal/switch_around.js'
import { saveToDB } from '../universal/manipulateDB';


export default function ChangeQuestion({ question }) {
    // const [value, setValue] = useState('')
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [questionlist, setQuestion] = useState(questions);
    // const [selectedOption, setSelectedOption] = useState('');
    const [questionvalue, setQuestionValue] = useState(question[id].question);
    const [options, setOptions] = useState(question[id].options)


    console.log(options)
    console.log((id))
    function SaveQuestion() {
        const saveArray = {
            question: questionvalue,
            questionId: id,
            options: options
        }
        saveToDB(saveArray, 'questions');
    }
    console.log(SaveQuestion)
    /* changes the state of div radio_box from false to true to allow input */
    const handleClick = () => {
        setIsEditing(true);
    }

    function switchOptions(list, fromIndex, toIndex) {
        const newList = SwitchAround(list, fromIndex, toIndex)
        setOptions(newList)
    }

    /* changes the question to the value that is put in the textarea element */
    const handleModify = (id, newQuestion) => {
        let updatedQuestion = questionlist.map(question => {
            if (question.id === id, newQuestion !== '') {
                return { ...question, question: newQuestion };
            } else {
                return question;

            }
        });
        setQuestion(updatedQuestion)
    };

    /* changes the option values of multiple choice questions */
    function replaceOptions(radioIndex, value) {
        const newOption = options.map((option, i) => {
            if (i === radioIndex) {
                option = value
                return option
            } else {
                return option
            }
        })
        setOptions(newOption)
    }
    /* Checks for whether the question type is Open or Multiple Choice depending on the id in the array. */
    function renderQuestion() {
        const question = questions[id];
        if (question.type === 'Open') {
            return (
                <>
                    <h1> Change Question {id}</h1>
                    <p><b>{questionlist[id].question}</b></p>
                </>
            )
        } else if (question.type === 'MultipleChoice') {
            return (
                <div>
                    <h1>Change Multiple Choice Question {id}</h1>
                    <p><b>{questionlist[id].question}</b></p>
                    {options.map((option, optionIndex) => {
                        return (
                            <div onClick={handleClick} className='radio_box'>
                                <div className='radio_div' key={option}>

                                    <input className='input'
                                        type='text'
                                        defaultValue={option}
                                        onChange={event => replaceOptions(optionIndex, event.target.value)}>
                                    </input>
                                    <button onClick={() => switchOptions(options, optionIndex, optionIndex - 1)}>Up</button>
                                    <button onClick={() => switchOptions(options, optionIndex, optionIndex + 1)}>Down</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
    /* re-renders the question in the textarea depending on the id parameter. */
    useEffect(() => {
        setQuestionValue(question[id].question);
    }, [id]);

    /* The main template of changeQuestion(). 
    We put in renderQuestion() on top to combine it. */

    return (
        <div>
            {renderQuestion()}
            {(questionvalue !== '')
                ? ''
                : <span style={{ color: 'red' }}>Vraag mag niet leeg zijn!</span>}
            {(questionvalue.length !== 250)
                ? ''
                : <span style={{ color: 'red' }}>Vraag kan niet meer dan 250 karakters bevatten</span>}
            <div className='save_question_border'>
                <div className='save_question_box'>
                    <textarea type='text' className='textarea' maxLength={250} value={questionvalue} onChange={(e) => setQuestionValue(e.target.value)}></textarea>
                    <button className='button' onClick={() => handleModify(question[id].id, questionvalue)}>Aanpassen</button>
                    <button className='button' onClick={() => SaveQuestion()}>Opslaan</button>
                </div>
            </div>

            {/* buttons for Previous and Next Id's in the Array. */}
            <Link to={id > 0 ? `/question/${question[id].id - 1}` : ''}><button disabled={id === '0'} className='button'>Previous</button></Link>
            {
                id < (questionlist.length - 1) ? /* if current id is lower than the questionlist array (-1  due to index!) */
                    <Link to={`/question/${question[id].id + 1}`}><button className='button'>Volgende</button></Link>
                    : /* button is disabled if there is no more questions with a higher id in the array.*/
                    <button disabled className='button'>Vorige</button>
            }
        </div>
    )
}

