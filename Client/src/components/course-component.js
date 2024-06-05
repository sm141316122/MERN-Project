import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CourseService from "../services/course.service";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  let [courseData, setCourseData] = useState(null);
  const navigate = useNavigate();
  const handleToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.foundUser._id;
      if (currentUser.foundUser.role == "instructor") {
        CourseService.get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.foundUser.role == "student") {
        CourseService.getEnrolled(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>登入後才可看到課程</p>
          <button onClick={handleToLogin} className="btn btn-primary btn-large">
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.foundUser.role == "instructor" && (
        <div>
          <h1>講師課程頁面</h1>
        </div>
      )}
      {currentUser && currentUser.foundUser.role == "student" && (
        <div>
          <h1>學生課程頁面</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexwrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱：{course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數：{course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格：{course.price}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師：{course.instructor.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
