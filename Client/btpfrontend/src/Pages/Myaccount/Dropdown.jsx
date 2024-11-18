import React, { useState } from 'react';
import { Select } from 'antd';
import styles from './Dropdown.module.css';

const { Option } = Select;

const data = [
    {
        title: "Programming Basics",
        id: "subject-001",
        courses: [
            {
                _id: "course-101",
                title: "JavaScript Basics",
                units: [
                    { _id: "unit-001", title: "Variables and Data Types" },
                    { _id: "unit-002", title: "Functions and Scope" },
                ],
            },
            {
                _id: "course-102",
                title: "React Fundamentals",
                units: [
                    { _id: "unit-003", title: "JSX and Components" },
                    { _id: "unit-004", title: "State and Props" },
                ],
            },
        ],
    },
    {
        title: "Advanced Programming",
        id: "subject-002",
        courses: [
            {
                _id: "course-201",
                title: "Data Structures",
                units: [
                    { _id: "unit-005", title: "Arrays and Linked Lists" },
                    { _id: "unit-006", title: "Stacks and Queues" },
                ],
            },
            {
                _id: "course-202",
                title: "Algorithms",
                units: [
                    { _id: "unit-007", title: "Sorting Algorithms" },
                    { _id: "unit-008", title: "Graph Algorithms" },
                ],
            },
        ],
    },
];

const DropdownComponent = () => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);

    // Handle subject selection
    const handleSubjectChange = (subjectId) => {
        setSelectedSubject(data.find((subject) => subject.id === subjectId));
        setSelectedCourse(null);
        setSelectedUnit(null);
    };

    // Handle course selection
    const handleCourseChange = (courseId) => {
        setSelectedCourse(selectedSubject.courses.find((course) => course._id === courseId));
        setSelectedUnit(null);
    };

    // Handle unit selection
    const handleUnitChange = (unitId) => {
        const unit = selectedCourse.units.find((unit) => unit._id === unitId);
        setSelectedUnit(unit);
    };

    return (
        <div className={styles.dropdownContainer}>
            {/* Subject Dropdown */}
            <Select
                className={styles.dropdown}
                placeholder="Select a Subject"
                onChange={handleSubjectChange}
                style={{ width: '100%' }}
            >
                {data.map((subject) => (
                    <Option key={subject.id} value={subject.id}>
                        {subject.title}
                    </Option>
                ))}
            </Select>

            {/* Course Dropdown */}
            {selectedSubject && (
                <Select
                    className={styles.dropdown}
                    placeholder="Select a Course"
                    onChange={handleCourseChange}
                    style={{ width: '100%', marginTop: '16px' }}
                >
                    {selectedSubject.courses.map((course) => (
                        <Option key={course._id} value={course._id}>
                            {course.title}
                        </Option>
                    ))}
                </Select>
            )}

            {/* Unit Dropdown */}
            {selectedCourse && (
                <Select
                    className={styles.dropdown}
                    placeholder="Select a Unit"
                    onChange={handleUnitChange}
                    style={{ width: '100%', marginTop: '16px' }}
                >
                    {selectedCourse.units.map((unit) => (
                        <Option key={unit._id} value={unit._id}>
                            {unit.title}
                        </Option>
                    ))}
                </Select>
            )}

            {/* Selected Unit Details */}
            {selectedUnit && (
                <div className={styles.unitDetails}>
                    <p>
                        <strong>Selected Unit ID:</strong> {selectedUnit._id}
                    </p>
                    <p>
                        <strong>Selected Unit Title:</strong> {selectedUnit.title}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DropdownComponent;
