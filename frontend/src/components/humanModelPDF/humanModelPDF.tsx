

import {
    StyleSheet,
    Document,
    Text,
    View,
    Page,
    Image,
    Font,
} from "@react-pdf/renderer";
import { Fragment } from "react";
import logo from '../../assets/VDS_LOGO.png';


Font.register({
    family: "Open Sans",
    fonts: [
        {
            src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
            fontWeight: 700,
        },
    ],
});


//create style classes for the class PDF
const styles = StyleSheet.create({
    table: {
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginHorizontal: "auto",
        marginTop: "10px",
    },
    tableRow: {
        margin: "auto",
        display: "flex",
        flexDirection: "row",
    },
    tableCol: {
        width: "16.6%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCell: {
        paddingTop: "5px",
        paddingBottom: "3px",
        textAlign: "center",
        fontSize: 12,
    },
    headerFont: {
        margin: "auto",
        marginTop: 5,
        fontSize: 15,
        fontWeight: "bold",
    },
    HeaderCol: {
        width: "16.6%",
        backgroundColor: "#eff5f5",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    logo: {
        margin: "auto",
        marginBottom: "0px",
        width: "200px",
        height: "80px",
        marginTop: "20px",
    },
    title: {
        textAlign: "center",
        fontFamily: "Open Sans",
        fontWeight: "bold",
        fontSize: "20px",
        marginTop: "10px",
    },
    pageNo: {
        color: "#babec2",
        fontSize: "15px",
        position: "absolute",
        bottom: "5px",
        width: "100%",
        textAlign: "center",
    },
    copyright: {
        color: "#e0e1e2",
        fontSize: "10px",
        fontStyle: "italic",
        marginTop: "20px",
        padding: "10px",
        textAlign: "justify",
    },
    rDetails: {
        fontSize: "10px",
        marginLeft: "13px",
    },
    border: {
        borderStyle: "solid",
        borderWidth: "1pt",
        borderColor: "black",
        height: "98%",
        padding: "10px",
        margin: "5px"
    },
});


//generating PDF
export const HumanPDF = ({ data }: any) => {

    const today = new Date;
    return (

        <>
            <Document>
                <Page size="A4" orientation="landscape">
                    <View style={styles.border}>
                    <Image src={logo} style={styles.logo} />
                        <Text style={styles.title}>Virtual Dressing Room Stock Report</Text>
                        <Text style={styles.title}>Human Model Report</Text>
                        <View>
                            <Text style={[styles.rDetails, { marginTop: "40px", marginBottom: "5px" }]}>Created Date : {`${today.getFullYear()} / ${today.getMonth() + 1} / ${today.getDate()}`}</Text>
                            <Text style={[styles.rDetails, { marginBottom: "5px" }]}>Created Time : {`${today.getHours()}.${today.getMinutes()}.${today.getSeconds()}`}</Text>
                        </View>
                        <Fragment>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <View style={styles.HeaderCol}>
                                        <Text style={styles.headerFont}>Model Name</Text>
                                    </View>
                                    <View style={styles.HeaderCol}>
                                        <Text style={styles.headerFont}>chest Width</Text>
                                    </View>
                                    <View style={styles.HeaderCol}>
                                        <Text style={styles.headerFont}>Height</Text>
                                    </View>
                                    <View style={styles.HeaderCol}>
                                        <Text style={styles.headerFont}>Bust</Text>
                                    </View>
                                    <View style={styles.HeaderCol}>
                                        <Text style={styles.headerFont}>Weist</Text>
                                    </View>
                                    <View style={styles.HeaderCol}>
                                        <Text style={styles.headerFont}>Hip</Text>
                                    </View>
                                </View>

                                {/* Table Row Data*/}
                                {data !== null
                                    ? data.map((data: any, i: any) => (
                                        <View key={i} style={styles.tableRow}>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{data.name}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{data.chestWidth}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{data.height}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{data.bust}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{data.weist}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{data.hip}</Text>
                                            </View>
                                        </View>
                                    ))
                                    : null}
                            </View>
                        </Fragment>
                        <View>
                            <Text style={styles.copyright}>
                                This PDF document and its content, including text, images, and
                                formatting, are protected by copyright law.
                                The document has been
                                generated using an automated system
                                developed by Virtual Dressing Room. The use, reproduction, distribution, or
                                modification of this document or its content without prior written
                                permission from Virtual Dressing Room System is strictly
                                prohibited and may result in legal action
                            </Text>
                        </View>
                        <Text
                            style={styles.pageNo}
                            render={({ pageNumber, totalPages }) =>
                                `${pageNumber} / ${totalPages}`
                            }
                            fixed
                        />
                    </View>
                </Page>
            </Document>
        </>
    );
};

export default HumanPDF;
