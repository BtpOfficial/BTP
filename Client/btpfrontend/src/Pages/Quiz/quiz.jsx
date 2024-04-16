import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import questions from "./data.js"
import Styles from "./quiz.module.css"
import { message } from 'antd';

const Quiz = () => {
    const { topicId } = useParams();
    // const getquiz = async() => {
    //     try {
    //         const res = await fetch('http://localhost:3001/', {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //         const fetchedData = await res.json();
    //         setData(fetchedData);
    //     } catch (error) {
    //         console.error('Data not found', error.message);
    //     }
    // }
    const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(null));

    const handleSubmit = async () => {
        const hasNullOption = selectedOptions.some(option => option === null);
        if (hasNullOption) {
            message.info("Complete all questions");
            return;
        }
        var res;
        try {
            res = await fetch('http://localhost:3001//verifyquiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedOptions)
            })
        } catch (error) {
            message.error('Some error occured');
        }
        if (res.status === 200) {
        }

    }
    const handleOptionChange = (questionIndex, optionValue) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[questionIndex] = optionValue;
        setSelectedOptions(newSelectedOptions);
    };
    useEffect(() => {
        // getquiz();
    }, [])
    return (
        <>
            <div className={Styles.container}>
                <div className={Styles.container}>
                    {questions.map((questionObj, index) => (
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
        </>
    );
}

export default Quiz;
