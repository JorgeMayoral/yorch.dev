import { Button } from '@chakra-ui/button';
import { Box, Link, Text } from '@chakra-ui/layout';

const Course = ({ title, description, courseLink, certificate }) => {
  return (
    <Box mt={8}>
      <Text fontSize="xl" mb={2}>
        {title}
      </Text>
      <Text mb={2}>{description}</Text>
      <Link href={courseLink} target="blank" mr={2}>
        <Button bgColor="#00adb5">Curso</Button>
      </Link>
      <Link href={`/courses/${certificate}`} target="blank">
        <Button bgColor="#00adb5">Certificado</Button>
      </Link>
    </Box>
  );
};

export default Course;
