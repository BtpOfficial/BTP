import User from "../models/User";

export const markComplete = async (req,res) => {
    try {
        const { subjectId , courseId , unitId , topicId } = req.params;
        const { userId } = req.body;
        const user = await User.findById(userId);
        let progress = user.progress;
        let t = -1;
        for(let i = 0; i < progress.length ; i++) {
            if(progress[i].subjectId === subjectId) {
                t = i;
                break;
            }
        }
       if(t === -1) {
            progress.push({
                subjectId,
                courseList : [],
            })
            t = progress.length -1;
       };

       progress = progress[t].courseList;
       t = -1;
       for(let i = 0; i < progress.length ; i++) {
            if(progress[i].courseId === courseId) {
                t = i;
                break;
            }
       }
       if(t === -1) {
            progress.push({
                courseId,
                unitList : [],
            })
            t = progress.length - 1;
       }

       progress = progress[t].unitList;
       t = -1;
       for(let i = 0; i < progress.length ;i++) {
        if(progress[i].unitId === unitId) {
            t = i;
            break;
        }
       }
       if(t === -1) {
            progress.push({
                unitId,
                topicList : [],
            })
            t = progress.length - 1;
       }

       progress = progress[t].topicList;
       t = progress.indexOf(topicId);
       if(t === -1) {
        progress.push(topicId);
       }

       const final_user = await user.save();
       res.status(201).json(final_user);

    } catch(err) {
        res.status(400).json({ message : err.message });
    }
};

export const markCompleteQuestion = async (req,res) => {
    try {
        
        const { userId } = req.body;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch(err) {
        res.status(400).json({ message : err.message });
    }
};
