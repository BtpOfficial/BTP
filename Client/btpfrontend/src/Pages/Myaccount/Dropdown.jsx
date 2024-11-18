import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import axios from 'axios';
import styles from './Dropdown.module.css';
import GetScore from './Getscore';

const { Option } = Select;

const DropdownComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3001/subjectHeiarchy');
                setData(response.data.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle subject selection
    const handleSubjectChange = (subjectId) => {
        const subject = data.find((item) => item.subjectId === subjectId);
        setSelectedSubject(subject);
        setSelectedCourse(null);
        setSelectedUnit(null);
    };

    // Handle course selection
    const handleCourseChange = (courseId) => {
        const course = selectedSubject?.courses.find((item) => item.courseId === courseId);
        setSelectedCourse(course);
        setSelectedUnit(null);
    };

    // Handle unit selection
    const handleUnitChange = (unitId) => {
        const unit = selectedCourse?.units.find((item) => item.unitId === unitId);
        setSelectedUnit(unit);
    };

    if (loading) {
        return <Spin size="large" />;
    }

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
                    <Option key={subject.subjectId} value={subject.subjectId}>
                        {subject.title}
                    </Option>
                ))}
            </Select>

            {/* Course Dropdown */}
            {selectedSubject && selectedSubject.courses.length > 0 && (
                <Select
                    className={styles.dropdown}
                    placeholder="Select a Course"
                    onChange={handleCourseChange}
                    style={{ width: '100%', marginTop: '16px' }}
                >
                    {selectedSubject.courses.map((course) => (
                        <Option key={course.courseId} value={course.courseId}>
                            {course.title}
                        </Option>
                    ))}
                </Select>
            )}

            {/* Unit Dropdown */}
            {selectedCourse && selectedCourse.units.length > 0 && (
                <Select
                    className={styles.dropdown}
                    placeholder="Select a Unit"
                    onChange={handleUnitChange}
                    style={{ width: '100%', marginTop: '16px' }}
                >
                    {selectedCourse.units.map((unit) => (
                        <Option key={unit.unitId} value={unit.unitId}>
                            {unit.title}
                        </Option>
                    ))}
                </Select>
            )}

            {/* Selected Unit Details */}
            {selectedUnit && (
                <div className={styles.unitDetails}>
                    <GetScore unitId={selectedUnit.unitId} />

                </div>
            )}
        </div>
    );
};

export default DropdownComponent;
