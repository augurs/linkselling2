import React from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../Context/languageContext'
import { translate } from '../../../utility/helper'

const Dummy = () => {

    const { languageData } = useLanguage()

    console.log(languageData , "11");


    const columns = [
        {
            name: translate(languageData , "Name"),
            selector: row => row.name,
            sortable: true,
            left : true,
             width: '130px'
        },
        {
            name: translate(languageData , "Address"),
            selector: row => row.address,
            sortable: true,
            left : true,
            //  width: '180px'
        },
        {
            name: translate(languageData , "NipNumber"),
            selector: row => row.nip,
            sortable: true,
            left : true,
            //  width: '180px'
        },
        {
            name: translate(languageData , "Invoices"),
            selector: row => row.invoice,
            cell: (row) => (
                <Link to={`http://${row.invoice}`} target="_blank" style={{ textDecoration: "underline" }}>
                    {row.invoice}
                </Link>
            ),
            sortable: true,
            left : true,
            //  width: '180px'
        },
        {
            name: translate(languageData , "Action"),
            cell: row => <button className='btn btn-primary '>{translate(languageData , "ChangeDetails")}</button>,
            left : true,
            //  width: '180px'
        },
    ]


    const data = [
        {
            name: "abc",
            address: "C-16 ,Vibhuti Khand , Gomtinagar , Lko",
            nip: "2348923as923",
            invoice: "invoice1.pdf"
        },
        {
            name: "abc",
            address: "C-16 ,Vibhuti Khand , Gomtinagar , Lko",
            nip: "2348923as923",
            invoice: "invoice2.pdf"
        },
        {
            name: "abc",
            address: "C-16 ,Vibhuti Khand , Gomtinagar , Lko",
            nip: "2348923as923",
            invoice: "invoice3.pdf"
        },
        {
            name: "abc",
            address: "C-16 ,Vibhuti Khand , Gomtinagar , Lko",
            nip: "2348923as923",
            invoice: "invoice4.pdf"
        },

    ]



    return (
        <div className='p-4'>
            <DataTable
                // selectableRowsComponent={Checkbox}
                columns={columns}
                data={data}
            // selectableRows
            // selectableRowsHighlight
            // selectableRowsHeader
            // selectableRowsHeaderComponent={checkboxHeader}

            /></div>
    )
}

export default Dummy