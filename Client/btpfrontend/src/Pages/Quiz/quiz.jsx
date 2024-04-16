import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Styles from "./quiz.module.css"
import { message } from 'antd';
import { BarLoader } from 'react-spinners'
const Quiz = () => {
    const [loading, setloading] = useState(false);
    const { topicId } = useParams();
    const [quizData, setQuizData] = useState([]);
    const [quizId, setquizId] = useState(null);

    const [selectedOptions, setSelectedOptions] = useState(Array(quizData.length).fill(null));
    const getquiz = async () => {
        try {
            const res = await fetch(`http://localhost:3001/users/${topicId}/getquiz`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const fetchedData = await res.json();
            setQuizData(fetchedData.quizArray);
            setquizId(fetchedData._id)
        } catch (error) {
            console.error('Data not found', error.message);
        }
    }

    const handleSubmit = async () => {
        const hasNullOption = selectedOptions.some(option => option === null);
        if (hasNullOption) {
            message.info("Complete all questions");
            return;
        }
        let res;
        try {
            res = await fetch(`http://localhost:3001/users/${quizId}/verifyquiz`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedOptions)
            })
        } catch (error) {
            console.log(error)
            message.error('Some error occured');
        }

    }
    const handleOptionChange = (questionIndex, optionValue) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[questionIndex] = optionValue;
        setSelectedOptions(newSelectedOptions);
    };
    useEffect(() => {
        getquiz();
    }, [])
    return (
        <>
            {loading ? <div className={Styles.loading}><BarLoader /></div> :
                <div className={Styles.container}>
                    <div className={Styles.container}>
                        {quizData.map((questionObj, index) => (
                            <div key={index} className={Styles.container_ques} >
                                <h3>{questionObj.question}</h3>
                                <ul className={Styles.container_opt}>
                                    {Object.entries(questionObj.options).map(([key, value]) => (
                                        <li key={key}>
                                            <input
                                                type="radio"
                                                name={`question_${index}`}
                                                value={key}
                                                onChange={() => handleOptionChange(index, key)}
                                                checked={selectedOptions[index] === key}
                                            />
                                            &nbsp;
                                            <label>{value}</label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className={Styles.cont_button_div}>
                        <button onClick={handleSubmit} className={Styles.cont_button}>
                            Submit
                        </button>
                    </div>
                </div>
            }
        </>
    );
}

export default Quiz;
