import ChainSiswaId from "@/components/chain-siswa-id";
import CardAcademic from "@/components/card-academic";
import FormDataOrangTua from "@/components/form-data-orang-tua";
import FormDataSiswa from "@/components/form-data-siswa";
import GridStudentId from "@/components/grid-student-id";

export default function PageStudentId() {
  return (
    <>

      <GridStudentId
        component1={<FormDataOrangTua />}
        component2={<FormDataSiswa />}
        component3={<ChainSiswaId />}
        component4={<CardAcademic />}
        component5={<span className="text-4xl font-bold">5</span>}
      />



    </>
  );
}