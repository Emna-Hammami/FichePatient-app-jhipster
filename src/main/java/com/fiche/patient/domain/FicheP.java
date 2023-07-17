package com.fiche.patient.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FicheP.
 */
@Entity
@Table(name = "fichep")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FicheP implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "num_dossier", nullable = false, unique = true)
    private Integer numDossier;

    @NotNull
    @Column(name = "nom_patient", nullable = false)
    private String nomPatient;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FicheP id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumDossier() {
        return this.numDossier;
    }

    public FicheP numDossier(Integer numDossier) {
        this.setNumDossier(numDossier);
        return this;
    }

    public void setNumDossier(Integer numDossier) {
        this.numDossier = numDossier;
    }

    public String getNomPatient() {
        return this.nomPatient;
    }

    public FicheP nomPatient(String nomPatient) {
        this.setNomPatient(nomPatient);
        return this;
    }

    public void setNomPatient(String nomPatient) {
        this.nomPatient = nomPatient;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FicheP)) {
            return false;
        }
        return id != null && id.equals(((FicheP) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FicheP{" +
            "id=" + getId() +
            ", numDossier=" + getNumDossier() +
            ", nomPatient='" + getNomPatient() + "'" +
            "}";
    }
}
