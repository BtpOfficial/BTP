import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Styles from "./quiz.module.css";
import { message } from 'antd';
import { BarLoader } from 'react-spinners';
const Quiz = () => {
    const [loading, setLoading] = useState(false);
    const { topicId } = useParams();
    const [quizData, setQuizData] = useState([]);
    const [quizId, setQuizId] = useState(null);
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const navigate = useNavigate();

    const getQuiz = async () => {
        try {
            const res = await fetch(`http://localhost:3001/users/${topicId}/getquiz`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.status === 404) {
                message.error('Quiz not found');
                navigate(-1)
                return;
            }
            const fetchedData = await res.json();
            setQuizData(fetchedData.quizArray);
            setQuizId(fetchedData._id);
            setSelectedOptions(Array(fetchedData.quizArray.length).fill(null));
        } catch (error) {
            console.error('Data not found', error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasNullOption = selectedOptions.some(option => option === null);
        if (hasNullOption) {
            message.info("Complete all questions");
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3001/users/${quizId}/verifyquiz`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ response: selectedOptions })
            });
            if (res.status === 200) {
                const data = await res.json();
                setResponse(data);
                window.scrollTo({
                    top: 0,
                    behavior: "smooth" // Optional: smooth scrolling effect
                });
            } else {
                message.error('Some error occurred');
            }
        } catch (error) {
            console.log(error);
            message.error('Some error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionChange = (questionIndex, optionValue) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[questionIndex] = optionValue;
        setSelectedOptions(newSelectedOptions);
    };

    useEffect(() => {
        getQuiz();
    }, []);

    return (
        <>
            {loading ? (
                <div className={Styles.loading}>
                    <BarLoader />
                </div>
            ) : (

                <div className={Styles.container}>
                    <div className={Styles.score}>
                        {response && <p>You Scored - {response}%</p>}
                    </div>
                    {quizData.map((questionObj, index) => (
                        <div key={index} className={Styles.container_ques}>
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
                    <div className={Styles.cont_button_div}>
                        <button onClick={handleSubmit} className={Styles.cont_button}>
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Quiz;