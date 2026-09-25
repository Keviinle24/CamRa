import CustomErrorPage from '../components/CustomErrorPage';

export default function Custom403() {
    return <CustomErrorPage statusCode={403} message="Forbidden" />;
}
