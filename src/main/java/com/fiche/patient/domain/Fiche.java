package com.fiche.patient.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Fiche.
 */
@Entity
@Table(name = "fiche")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Fiche implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Hopital ficheHop;

    @ManyToOne(fetch = FetchType.LAZY)
    private Hopital hopital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "hopital", "chefService" }, allowSetters = true)
    private Service service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "hopital", "service" }, allowSetters = true)
    private Medecin medecin;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Fiche id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Hopital getFicheHop() {
        return this.ficheHop;
    }

    public void setFicheHop(Hopital hopital) {
        this.ficheHop = hopital;
    }

    public Fiche ficheHop(Hopital hopital) {
        this.setFicheHop(hopital);
        return this;
    }

    public Hopital getHopital() {
        return this.hopital;
    }

    public void setHopital(Hopital hopital) {
        this.hopital = hopital;
    }

    public Fiche hopital(Hopital hopital) {
        this.setHopital(hopital);
        return this;
    }

    public Service getService() {
        return this.service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public Fiche service(Service service) {
        this.setService(service);
        return this;
    }

    public Medecin getMedecin() {
        return this.medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public Fiche medecin(Medecin medecin) {
        this.setMedecin(medecin);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Fiche)) {
            return false;
        }
        return id != null && id.equals(((Fiche) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Fiche{" +
            "id=" + getId() +
            "}";
    }
}
