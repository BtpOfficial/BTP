import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Styles from "./quiz.module.css";
import { message } from 'antd';
import { BarLoader } from 'react-spinners';
import { useSelector } from "react-redux";
const Quiz = () => {
    const [loading, setLoading] = useState(false);
    const { topicId } = useParams();
    const [quizData, setQuizData] = useState([]);
    const [quizId, setQuizId] = useState(null);
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [descriptiveAnswers, setDescriptiveAnswers] = useState([]);
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
            setSelectedOptions(Array(fetchedData.quizArray.mcq.length).fill(null));
            setDescriptiveAnswers(Array(fetchedData.quizArray.descriptive.length).fill(""));
        } catch (error) {
            console.error('Data not found', error.message);
        }
    };
    const user_id = useSelector((state) => state.user?._id)
    console.log(user_id)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasNullOption = selectedOptions.some(option => option === null);
        const hasNulldesc = descriptiveAnswers.some(option => option === '');
        if (hasNullOption || hasNulldesc) {
            message.info("Complete all questions");
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3001/users/${topicId}/${quizId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id, selectedOptions, descriptiveAnswers })
            });
            if (res.status === 200) {
                const data = await res.json();
                setResponse(data);
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
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
    const handleDescriptiveChange = (questionIndex, value) => {
        const newDescriptiveAnswers = [...descriptiveAnswers];
        newDescriptiveAnswers[questionIndex] = value;
        setDescriptiveAnswers(newDescriptiveAnswers);
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
                    {quizData && quizData?.mcq && quizData?.mcq.map((questionObj, index) => (
                        <div key={index} className={Styles.container_ques}>
                            <h3><strong>{index + 1}. </strong>{questionObj.question}</h3>
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

                    {quizData && quizData?.descriptive && quizData?.descriptive.map((questionObj, index) => (
                        <div key={index} className={Styles.container_ques}>
                            <h3><strong>{quizData?.mcq.length + index + 1}. </strong>{questionObj.question}</h3>
                            <textarea
                                name={`question_desc_${index}`}
                                value={descriptiveAnswers[index]}
                                onChange={(e) => handleDescriptiveChange(index, e.target.value)}
                                className={Styles.textarea}
                            />
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