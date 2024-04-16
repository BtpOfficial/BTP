import React, { useState } from "react";
import { useParams } from "react-router-dom";
import questions from "./data.js"
import Styles from "./quiz.module.css"
import { message } from 'antd';

const Quiz = () => {
    const { topicId } = useParams();
    const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(null));
    const handleSubmit = () => {
        const hasNullOption = selectedOptions.some(option => option === null);
        // If any selected option is null, log "hi" and return
        if (hasNullOption) {
            message.success("Complete all questions");
            return;
        }

    }
    const handleOptionChange = (questionIndex, optionValue) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[questionIndex] = optionValue;
        setSelectedOptions(newSelectedOptions);
    };
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
