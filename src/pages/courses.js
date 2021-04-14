import { Heading, Text } from '@chakra-ui/layout';
import Head from 'next/head';
import Course from '../components/Course';
import Layout from '../components/Layout';
import coursesData from '../data/courses.json';

const courses = () => {
  return (
    <Layout>
      <Head>
        <title>Cursos | DevYorch</title>
      </Head>

      <Heading>Cursos</Heading>

      <Text mb={4}>
        Aquí puedes ver una lista de cursos que he realizado con un enlace a su
        correspondiente certificado si lo hay.
      </Text>

      {coursesData.map((course) => (
        <Course
          title={course.title}
          description={course.description}
          courseLink={course.courseLink}
          certificate={course.certificate}
        />
      ))}
    </Layout>
  );
};

export default courses;
