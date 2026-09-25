import CustomErrorPage from '../components/CustomErrorPage';

export default function Custom400() {
    return <CustomErrorPage statusCode={400} message="Bad Request" />;
}
