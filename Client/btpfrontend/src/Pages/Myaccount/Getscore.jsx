import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useSelector } from 'react-redux';

const GetScore = ({ unitId }) => {
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = useSelector((state) => state.user._id);
    console.log(userId)
    // Fetch average score
    const fetchScore = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("this is user", userId)
            const response = await axios.post(`http://localhost:3001/${unitId}/getAverage`, { "userId": userId });
            const averageScore = response.data.score;
            setScore(averageScore);
        } catch (err) {
            console.error('Error fetching score:', err);
            setError('Failed to fetch score');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (unitId) {
            fetchScore();
        }
    }, [unitId]);

    // Pie chart data
    const data = [
        { name: 'Average Score', value: score || 0 },
        { name: 'Remaining', value: 100 - (score || 0) },
    ];

    const COLORS = ['#00C49F', '#FF8042'];

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {loading ? (
                <p>Loading score...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : score !== null ? (
                <>
                    <h3>Average Score for Unit</h3>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={data}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                    <p>
                        <strong>Score:</strong> {score}% out of 100
                    </p>
                </>
            ) : (
                <p>No score data available.</p>
            )}
        </div>
    );
};

export default GetScore;
