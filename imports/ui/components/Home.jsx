import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { _Courses } from '../../api/courses/courses';
import { _Units } from '../../api/units/units';
import Courses from './content/Courses.jsx';
import { FloatingButton } from './Utilities/Utilities.jsx';
import ImgSlider from '../components/layouts/ImageSlider';
import * as Config from '../../../config.json';
import { Loader } from './Loader';
import ErrorBoundary from './ErrorBoundary'; // eslint-disable-line
import { ThemeContext } from '../containers/AppWrapper';

export class Home extends Component {
  componentDidMount() {
    if (!Config.isConfigured) {
      FlowRouter.go('/setup');
    }
  }

  renderCourses() {
    let index = 0;
    const { courses } = this.props;
    if (!courses) {
      return <span> No Courses </span>;
    } else if (courses.length === 0) {
      return <p> There are no Contents yet </p>;
    }
    return courses.map(cours => <Courses key={index++} course={cours} />);
  }

  render() {
    const { courseReady } = this.props;
    return (
      <ErrorBoundary>
        <ThemeContext.Consumer>
          {({ state }) => (
            <Fragment>
              <ImgSlider isDark={state.isDark} />
              <div className="container ">
                <div className="row ">
                  {courseReady ? this.renderCourses() : <Loader />}
                </div>
                <FloatingButton />
              </div>
            </Fragment>
          )}
        </ThemeContext.Consumer>
      </ErrorBoundary>
    );
  }
}

Home.propTypes = {
  unit: PropTypes.array,
  courses: PropTypes.array,
  subsReady: PropTypes.bool,
  courseReady: PropTypes.bool,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('courses');
  Meteor.subscribe('slides');
  Meteor.subscribe('titles');
  return {
    courseReady: handle.ready(),
    unit: _Units.find().fetch(),
    courses: _Courses
      .find(
        {},
        {
          fields: {
            name: 1,
            details: 1,
          },
        },
      )
      .fetch(),
  };
})(Home);
