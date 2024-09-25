import CustomErrorPage from '../components/CustomErrorPage';

export default function Custom404() {
    return <CustomErrorPage statusCode={404} message="Page Not Found" />;
}
